// Comportamento da casca do sistema. TypeScript puro, sem framework.

const raiz = document.documentElement;
const sistema = document.querySelector<HTMLElement>('.sistema')!;
const $ = <T extends Element = HTMLElement>(sel: string, base: ParentNode = document) => base.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, base: ParentNode = document) => [...base.querySelectorAll<T>(sel)];

// ---------- Preferências (só conveniência do visitante; falha sem problema) ----------

const CHAVE = 'igorj.';
// Parâmetros de URL valem só nesta visita e passam na frente do que está salvo (para testes e capturas).
const url = new URLSearchParams(location.search);
const ler = (k: string) => { if (url.has(k)) return url.get(k); try { return localStorage.getItem(CHAVE + k); } catch { return null; } };
const gravar = (k: string, v: string) => { try { localStorage.setItem(CHAVE + k, v); } catch {} };

// ---------- Tema ----------

function aplicarTema(tema: string) {
  if (tema === 'automatico') delete raiz.dataset.tema;
  else raiz.dataset.tema = tema;
  gravar('tema', tema);
  $$<HTMLInputElement>('input[data-tema-opcao]').forEach((i) => (i.checked = i.value === tema));
}
const temaAtual = () => raiz.dataset.tema ?? 'automatico';

// ---------- Aparelho e escala ----------

const telaPequena = matchMedia('(max-width: 700px), (pointer: coarse)');

function modoEscolhido() { return ler('modo') ?? 'auto'; }

function aplicarModo() {
  const escolhido = modoEscolhido();
  const celular = escolhido === 'celular' || (escolhido === 'auto' && telaPequena.matches);
  sistema.dataset.modo = celular ? 'celular' : 'computador';
  // Moldura só quando o celular aparece numa tela grande.
  if (celular && !telaPequena.matches) sistema.dataset.moldura = '';
  else delete sistema.dataset.moldura;
  aplicarEscala();
}

function aplicarEscala() {
  const escolhida = ler('escala') ?? 'auto';
  // Celular (com ou sem moldura) em escala 1: a tela já tem densidade alta e o texto de 16 px de arte fica no tamanho comum.
  const escala = escolhida === 'auto' ? (sistema.dataset.modo === 'celular' ? 1 : 2) : Number(escolhida);
  raiz.style.setProperty('--escala', String(escala));

  const dpr = window.devicePixelRatio || 1;
  if (ler('densidade') !== 'nao') {
    // Um pixel de arte ocupa um número inteiro de pixels do aparelho.
    const pixelsAparelho = Math.max(1, Math.round(escala * dpr));
    raiz.style.setProperty('--px', `${pixelsAparelho / dpr}px`);
  } else {
    raiz.style.removeProperty('--px');
  }
  const saida = document.querySelector<HTMLOutputElement>('output[data-teste="dpr"]');
  if (saida) saida.value = `${dpr} (escala ${escala})`;
}

// O zoom do navegador muda a densidade; reaplica quando isso acontece.
function vigiarDensidade() {
  const mq = matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
  mq.addEventListener('change', () => { aplicarEscala(); vigiarDensidade(); }, { once: true });
}

// ---------- Relógio ----------

function atualizarRelogios() {
  const agora = new Date();
  const texto = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  $$<HTMLTimeElement>('time.relogio').forEach((el) => {
    el.textContent = texto;
    el.dateTime = agora.toISOString();
  });
}

// ---------- Janelas ----------

const janelas = new Map<string, { janela: HTMLElement; tarefa: HTMLButtonElement }>();
let proximoZ = 1;
let cascata = 0;

function tituloDoApp(id: string) {
  return $(`.icone-area[data-app="${id}"] .rotulo, .menu-itens [data-app="${id}"] span`).textContent ?? id;
}

function clonarConteudo(id: string) {
  const modelo = document.getElementById(`app-${id}`) as HTMLTemplateElement;
  const conteudo = modelo.content.cloneNode(true) as DocumentFragment;
  $$<HTMLInputElement>('input[data-tema-opcao]', conteudo).forEach((i) => {
    i.name = `tema-${id}-${Math.random().toString(36).slice(2, 7)}`;
    i.checked = i.value === temaAtual();
  });
  return conteudo;
}

function ativar(janela: HTMLElement) {
  $$('.janela.ativa').forEach((j) => j.classList.remove('ativa'));
  janela.classList.add('ativa');
  janela.style.zIndex = String(++proximoZ);
  janelas.forEach(({ janela: j, tarefa }) => tarefa.setAttribute('aria-pressed', String(j === janela && !j.hidden)));
}

function abrir(id: string) {
  const existente = janelas.get(id);
  if (existente) { restaurar(id); return; }

  const modelo = document.getElementById('modelo-janela') as HTMLTemplateElement;
  const janela = (modelo.content.cloneNode(true) as DocumentFragment).firstElementChild as HTMLElement;
  const titulo = tituloDoApp(id);
  const idTitulo = `janela-${id}-titulo`;
  janela.dataset.app = id;
  janela.setAttribute('aria-labelledby', idTitulo);
  $('.titulo-texto', janela).id = idTitulo;
  $('.titulo-texto', janela).textContent = titulo;
  $('.titulo-icone', janela).append((document.getElementById(`icone16-${id}`) as HTMLTemplateElement).content.cloneNode(true));
  $('.corpo', janela).append(clonarConteudo(id));

  janela.style.left = `calc(${80 + cascata * 12} * var(--px))`;
  janela.style.top = `calc(${12 + cascata * 12} * var(--px))`;
  cascata = (cascata + 1) % 6;

  $('.janelas').append(janela);

  const li = document.createElement('li');
  const tarefa = document.createElement('button');
  tarefa.type = 'button';
  tarefa.className = 'tarefa';
  tarefa.append((document.getElementById(`icone16-${id}`) as HTMLTemplateElement).content.cloneNode(true));
  const rotulo = document.createElement('span');
  rotulo.textContent = titulo;
  tarefa.append(rotulo);
  tarefa.addEventListener('click', () => {
    if (!janela.hidden && janela.classList.contains('ativa')) minimizar(id);
    else restaurar(id);
  });
  li.append(tarefa);
  $('.tarefas').append(li);

  janelas.set(id, { janela, tarefa });
  ligarJanela(janela, id);
  ativar(janela);
  janela.focus();
}

function restaurar(id: string) {
  const { janela } = janelas.get(id)!;
  janela.hidden = false;
  ativar(janela);
  janela.focus();
}

function minimizar(id: string) {
  const { janela, tarefa } = janelas.get(id)!;
  janela.hidden = true;
  janela.classList.remove('ativa');
  tarefa.setAttribute('aria-pressed', 'false');
  tarefa.focus();
}

function fechar(id: string) {
  const { janela, tarefa } = janelas.get(id)!;
  janela.remove();
  tarefa.parentElement!.remove();
  janelas.delete(id);
  $<HTMLButtonElement>(`.icone-area[data-app="${id}"]`).focus();
}

function ligarJanela(janela: HTMLElement, id: string) {
  janela.addEventListener('pointerdown', () => ativar(janela));
  janela.addEventListener('focusin', () => ativar(janela));

  $$<HTMLButtonElement>('.controle', janela).forEach((botao) => {
    botao.addEventListener('click', () => {
      const acao = botao.dataset.acao;
      if (acao === 'fechar') fechar(id);
      else if (acao === 'minimizar') minimizar(id);
      else {
        const max = janela.classList.toggle('maximizada');
        botao.setAttribute('aria-label', max ? botao.dataset.restaurar! : botao.dataset.maximizar!);
      }
    });
  });

  // Arrastar pela barra de título.
  const titulo = $('.titulo', janela);
  titulo.addEventListener('pointerdown', (e) => {
    if ((e.target as Element).closest('.controle') || janela.classList.contains('maximizada')) return;
    const area = $('.area').getBoundingClientRect();
    const inicioX = e.clientX - janela.offsetLeft;
    const inicioY = e.clientY - janela.offsetTop;
    titulo.setPointerCapture(e.pointerId);
    const mover = (ev: PointerEvent) => {
      const x = Math.min(Math.max(ev.clientX - inicioX, -janela.offsetWidth + 40), area.width - 40);
      const y = Math.min(Math.max(ev.clientY - inicioY, 0), area.height - titulo.offsetHeight);
      janela.style.left = `${x}px`;
      janela.style.top = `${y}px`;
    };
    titulo.addEventListener('pointermove', mover);
    titulo.addEventListener('pointerup', () => titulo.removeEventListener('pointermove', mover), { once: true });
  });

  titulo.addEventListener('dblclick', (e) => {
    if (!(e.target as Element).closest('.controle')) $<HTMLButtonElement>('[data-acao="maximizar"]', janela).click();
  });
}

// ---------- Ícones da área de trabalho ----------

function ligarIcones() {
  $$<HTMLButtonElement>('.icone-area').forEach((botao) => {
    botao.addEventListener('click', (e) => {
      $$('.icone-area').forEach((b) => b.removeAttribute('aria-selected'));
      botao.setAttribute('aria-selected', 'true');
      // Teclado (detail 0) abre com Enter ou Espaço; mouse abre com duplo clique.
      if (e.detail === 0) abrir(botao.dataset.app!);
    });
    botao.addEventListener('dblclick', () => abrir(botao.dataset.app!));
  });
  $('.area').addEventListener('pointerdown', (e) => {
    if (!(e.target as Element).closest('.icone-area, .janela')) $$('.icone-area').forEach((b) => b.removeAttribute('aria-selected'));
  });
}

// ---------- Menu iniciar ----------

function ligarMenu() {
  const botao = $<HTMLButtonElement>('.iniciar');
  const menu = $('#menu-iniciar');
  const itens = $$<HTMLButtonElement>('[role="menuitem"]', menu);

  const abrirMenu = () => { menu.hidden = false; botao.setAttribute('aria-expanded', 'true'); itens[0].focus(); };
  const fecharMenu = (devolverFoco = true) => {
    menu.hidden = true; botao.setAttribute('aria-expanded', 'false');
    if (devolverFoco) botao.focus();
  };

  botao.addEventListener('click', () => (menu.hidden ? abrirMenu() : fecharMenu()));
  itens.forEach((item, i) => {
    item.addEventListener('click', () => { fecharMenu(false); abrir(item.dataset.app!); });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); itens[(i + 1) % itens.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); itens[(i - 1 + itens.length) % itens.length].focus(); }
      if (e.key === 'Escape') { e.preventDefault(); fecharMenu(); }
    });
  });
  document.addEventListener('pointerdown', (e) => {
    if (!menu.hidden && !(e.target as Element).closest('#menu-iniciar, .iniciar')) fecharMenu(false);
  });
}

// ---------- Celular ----------

function ligarCelular() {
  const grade = $('.grade-apps');
  const aberto = $('.app-aberto');
  let origem: HTMLButtonElement | null = null;

  const abrirApp = (botao: HTMLButtonElement) => {
    origem = botao;
    const id = botao.dataset.app!;
    $('.app-aberto-titulo').textContent = $('.rotulo', botao).textContent;
    const corpo = $('.app-aberto-corpo');
    corpo.replaceChildren(clonarConteudo(id));
    grade.hidden = true;
    aberto.hidden = false;
    $('.app-aberto-titulo').setAttribute('tabindex', '-1');
    $('.app-aberto-titulo').focus();
  };
  const voltarAoInicio = () => {
    if (aberto.hidden) return;
    aberto.hidden = true;
    grade.hidden = false;
    origem?.focus();
  };

  $$<HTMLButtonElement>('.app-celular').forEach((b) => b.addEventListener('click', () => abrirApp(b)));
  $('.nav-voltar').addEventListener('click', voltarAoInicio);
  $('.nav-inicio').addEventListener('click', voltarAoInicio);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sistema.dataset.modo === 'celular') voltarAoInicio();
  });
}

// ---------- Teclado global ----------

function ligarTeclado() {
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || sistema.dataset.modo !== 'computador') return;
    if (!$('#menu-iniciar').hidden) return; // o menu trata o próprio Esc
    const janela = (e.target as Element).closest?.('.janela') as HTMLElement | null;
    if (janela) fechar(janela.dataset.app!);
  });
}

// ---------- Painel de testes ----------

function ligarPainel() {
  const escala = $<HTMLSelectElement>('select[data-teste="escala"]');
  const densidade = $<HTMLInputElement>('input[data-teste="densidade"]');
  const gradiente = $<HTMLSelectElement>('select[data-teste="gradiente"]');
  const modo = $<HTMLSelectElement>('select[data-teste="modo"]');

  escala.value = ler('escala') ?? 'auto';
  densidade.checked = ler('densidade') !== 'nao';
  gradiente.value = ler('gradiente') ?? 'liso';
  modo.value = modoEscolhido();

  escala.addEventListener('change', () => { gravar('escala', escala.value); aplicarEscala(); });
  densidade.addEventListener('change', () => { gravar('densidade', densidade.checked ? 'sim' : 'nao'); aplicarEscala(); });
  gradiente.addEventListener('change', () => { gravar('gradiente', gradiente.value); raiz.dataset.gradiente = gradiente.value; });
  modo.addEventListener('change', () => { gravar('modo', modo.value); aplicarModo(); });
}

// ---------- Início ----------

export function iniciar() {
  const temaUrl = url.get('tema');
  if (temaUrl) { if (temaUrl === 'automatico') delete raiz.dataset.tema; else raiz.dataset.tema = temaUrl; }
  const gradienteUrl = url.get('gradiente');
  if (gradienteUrl) raiz.dataset.gradiente = gradienteUrl;
  aplicarModo();
  telaPequena.addEventListener('change', aplicarModo);
  vigiarDensidade();

  document.addEventListener('change', (e) => {
    const alvo = e.target as HTMLInputElement;
    if (alvo.matches('input[data-tema-opcao]')) aplicarTema(alvo.value);
  });

  atualizarRelogios();
  setInterval(atualizarRelogios, 15_000);

  ligarIcones();
  ligarMenu();
  ligarCelular();
  ligarTeclado();
  ligarPainel();

  const abrirUrl = url.get('abrir');
  if (abrirUrl) {
    if (sistema.dataset.modo === 'celular') $<HTMLButtonElement>(`.app-celular[data-app="${abrirUrl}"]`)?.click();
    else abrir(abrirUrl);
  }
}
