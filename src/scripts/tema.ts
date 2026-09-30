// Escolha de tema. Roda em todas as páginas, com ou sem a casca.

const raiz = document.documentElement;

export const temaAtual = () => raiz.dataset.tema ?? 'automatico';

// Marca, em todos os seletores de tema presentes, a opção em uso.
export function sincronizarTema() {
  document.querySelectorAll<HTMLInputElement>('input[data-tema-opcao]').forEach((i) => (i.checked = i.value === temaAtual()));
}

export function aplicarTema(tema: string) {
  if (tema === 'automatico') delete raiz.dataset.tema;
  else raiz.dataset.tema = tema;
  try { localStorage.setItem('igorj.tema', tema); } catch {}
  sincronizarTema();
}

export function ligarTema() {
  document.addEventListener('change', (e) => {
    const alvo = e.target as HTMLInputElement;
    if (alvo.matches?.('input[data-tema-opcao]')) aplicarTema(alvo.value);
  });
  sincronizarTema();
}
