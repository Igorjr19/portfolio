// Converte os ícones PNG em SVG com cores indexadas, para a arte trocar de cor com o tema.
// Saídas (geradas, fora do git):
//   src/icones/gerados/<nome>.svg          desenho, cada pixel com a classe do seu índice
//   src/temas/gerado/icones-<tema>.json    cor de cada índice em cada tema
// Temas com "paleta" (em terceiros/temas/) recebem a cor mais próxima da paleta;
// o tema padrão usa as cores originais do desenho.

import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { PNG } from 'pngjs';
import { icones, desenhados } from './icones.config.mjs';

const TERCEIROS = 'terceiros';
const lerJson = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null);
const fontesIcones = lerJson(`${TERCEIROS}/icones/icones.json`) ?? {};
const temasExtras = existsSync(`${TERCEIROS}/temas`)
  ? readdirSync(`${TERCEIROS}/temas`).filter((a) => a.endsWith('.json')).map((a) => lerJson(`${TERCEIROS}/temas/${a}`))
  : [];

const hex = (r, g, b) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');

// Cada linha vira retângulos de pixels vizinhos com o mesmo índice.
function svg(largura, altura, pixel, classe) {
  const rects = [];
  for (let y = 0; y < altura; y++) {
    let x = 0;
    while (x < largura) {
      const i = pixel(x, y);
      if (i === null) { x++; continue; }
      let fim = x + 1;
      while (fim < largura && pixel(fim, y) === i) fim++;
      const c = classe(i);
      rects.push(`<rect x="${x}" y="${y}" width="${fim - x}" height="1"${c ? ` class="${c}"` : ''}/>`);
      x = fim;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${largura} ${altura}" width="${largura}" height="${altura}" class="ico" shape-rendering="crispEdges" fill="currentColor" aria-hidden="true" focusable="false">${rects.join('')}</svg>\n`;
}

// Substituto de um ícone ausente: moldura com um quadrado no meio.
function substituto(t) {
  const m = Math.floor(t / 4);
  return svg(t, t, (x, y) => {
    const borda = x === 1 || y === 1 || x === t - 2 || y === t - 2;
    const miolo = x >= m + 1 && x < t - m - 1 && y >= m + 1 && y < t - m - 1;
    return (borda && x > 0 && y > 0 && x < t - 1 && y < t - 1) || miolo ? 1 : null;
  }, () => null);
}

// Distância perceptual em OKLab.
function oklab(h) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
const distancia = (a, b) => {
  const [x, y] = [oklab(a), oklab(b)];
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
};
const maisProxima = (cor, cores) => cores.reduce((melhor, c) => (distancia(cor, c) < distancia(cor, melhor) ? c : melhor));

rmSync('src/icones/gerados', { recursive: true, force: true });
rmSync('src/temas/gerado', { recursive: true, force: true });
mkdirSync('src/icones/gerados', { recursive: true });
mkdirSync('src/temas/gerado', { recursive: true });

const indices = new Map(); // cor original -> número do índice
let ausentes = 0;

for (const { nome, paleta, tamanho } of icones) {
  const arquivo = fontesIcones[nome] && `${TERCEIROS}/icones/${fontesIcones[nome]}`;
  if (!arquivo || !existsSync(arquivo)) {
    writeFileSync(`src/icones/gerados/${nome}.svg`, substituto(tamanho));
    ausentes++;
    continue;
  }
  const png = PNG.sync.read(readFileSync(arquivo));
  const corEm = (x, y) => {
    const p = (y * png.width + x) * 4;
    if (png.data[p + 3] < 128) return null;
    return hex(png.data[p], png.data[p + 1], png.data[p + 2]);
  };
  const conteudo = paleta === 'glifo'
    ? svg(png.width, png.height, (x, y) => (corEm(x, y) && corEm(x, y) !== '#ffffff' ? 1 : null), () => null)
    : svg(png.width, png.height, (x, y) => {
        const cor = corEm(x, y);
        if (cor === null) return null;
        if (!indices.has(cor)) indices.set(cor, indices.size + 1);
        return indices.get(cor);
      }, (i) => `i${i}`);
  writeFileSync(`src/icones/gerados/${nome}.svg`, conteudo);
}

for (const [nome, linhas] of Object.entries(desenhados)) {
  writeFileSync(`src/icones/gerados/${nome}.svg`, svg(linhas[0].length, linhas.length, (x, y) => (linhas[y][x] === '#' ? 1 : null), () => null));
}

const mapa = (f) => Object.fromEntries([...indices].map(([cor, i]) => [`ic-${i}`, f(cor)]));
writeFileSync('src/temas/gerado/icones-padrao.json', JSON.stringify(mapa((c) => c), null, 2) + '\n');
for (const tema of temasExtras) {
  const excluir = new Set(tema['paleta-excluir-icones'] ?? []);
  const cores = Object.entries(tema.paleta ?? {}).filter(([n]) => !excluir.has(n)).map(([, c]) => c);
  writeFileSync(`src/temas/gerado/icones-${tema.nome}.json`, JSON.stringify(cores.length ? mapa((c) => maisProxima(c, cores)) : mapa((c) => c), null, 2) + '\n');
}

const total = icones.length + Object.keys(desenhados).length;
console.log(`${total} ícones, ${indices.size} índices de cor${ausentes ? `, ${ausentes} substituídos (arte de terceiros ausente)` : ''}.`);
