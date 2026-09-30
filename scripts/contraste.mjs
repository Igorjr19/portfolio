// Auditoria de contraste dos temas.
// Texto: mínimo 4,5:1. Borda ou controle que é a única indicação: mínimo 3:1.

import { existsSync, readFileSync, readdirSync } from 'node:fs';

// Tema padrão, mais os temas de terceiros presentes (terceiros/temas/, fora do git).
const lerJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const extras = existsSync('terceiros/temas')
  ? readdirSync('terceiros/temas').filter((a) => a.endsWith('.json')).map((a) => lerJson(`terceiros/temas/${a}`))
  : [];
const temas = [lerJson('src/temas/padrao.json'), ...extras];

// [primeiro plano, fundo, mínimo]
const pares = [
  ['texto', 'janela-fundo', 4.5],
  ['texto-suave', 'janela-fundo', 4.5],
  ['botao-texto', 'botao-fundo', 4.5],
  ['destaque-texto', 'destaque', 4.5],
  ['janela-titulo-texto', 'janela-titulo', 4.5],
  ['janela-titulo-texto', 'janela-titulo-realce', 4.5],
  ['janela-titulo-texto', 'janela-titulo-sombra', 4.5],
  ['janela-titulo-inativa-texto', 'janela-titulo-inativa', 4.5],
  ['barra-texto', 'barra-fundo', 4.5],
  ['barra-texto', 'barra-botao', 4.5],
  ['barra-texto', 'barra-botao-ativo', 4.5],
  ['barra-texto', 'barra-sombra', 4.5],
  ['iniciar-texto', 'iniciar-fundo', 4.5],
  ['iniciar-texto', 'iniciar-realce', 4.5],
  ['iniciar-texto', 'iniciar-sombra', 4.5],
  ['rotulo-icone-texto', 'fundo-area', 4.5],
  ['celular-status-texto', 'celular-status-fundo', 4.5],
  ['perigo', 'janela-fundo', 4.5],
  ['sucesso', 'janela-fundo', 4.5],
  ['aviso', 'janela-fundo', 4.5],
  ['foco', 'janela-fundo', 3],
  ['destaque', 'janela-fundo', 4.5], // links nas páginas simples
];

const lum = (h) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

let falhas = 0;
for (const tema of temas) {
  console.log(`\n${tema.nome}`);
  for (const [frente, fundo, minimo] of pares) {
    const r = razao(tema.cores[frente], tema.cores[fundo]);
    const ok = r >= minimo;
    if (!ok) falhas++;
    console.log(`  ${ok ? 'ok   ' : 'FALHA'} ${r.toFixed(2).padStart(5)}:1 (mín. ${minimo})  ${frente} sobre ${fundo}`);
  }
}
// Limite da janela: o corpo ou a borda precisa se separar da área de trabalho (3:1).
for (const tema of temas) {
  const c = tema.cores;
  const r = Math.max(razao(c['janela-fundo'], c['fundo-area']), razao(c['janela-borda'], c['fundo-area']));
  const ok = r >= 3;
  if (!ok) falhas++;
  console.log(`${tema.nome}: ${ok ? 'ok   ' : 'FALHA'} ${r.toFixed(2).padStart(5)}:1 (mín. 3)  limite da janela (corpo ou borda sobre fundo-area)`);
}
console.log(`\n${falhas} falha(s).`);
process.exitCode = falhas ? 1 : 0;
