// Prepara as fontes de terceiros, se existirem em terceiros/fontes/ (fora do git).
// Copia os arquivos para public/fontes/ e gera src/estilos-gerados/fontes.css com os @font-face
// e as variáveis de fonte. Sem fontes de terceiros, o CSS fica vazio e valem as fontes do sistema.

import { existsSync, readFileSync, mkdirSync, copyFileSync, writeFileSync, rmSync, readdirSync } from 'node:fs';

const ORIGEM = 'terceiros/fontes';
const manifesto = existsSync(`${ORIGEM}/fontes.json`) ? JSON.parse(readFileSync(`${ORIGEM}/fontes.json`, 'utf8')) : null;

rmSync('public/fontes', { recursive: true, force: true });
mkdirSync('src/estilos-gerados', { recursive: true });

if (!manifesto) {
  writeFileSync('src/estilos-gerados/fontes.css', '/* Sem fontes de terceiros: valem as fontes do sistema. */\n');
  console.log('Fontes: sem fontes de terceiros, usando as do sistema.');
  process.exit(0);
}

mkdirSync('public/fontes', { recursive: true });
const presentes = manifesto.arquivos.filter((f) => existsSync(`${ORIGEM}/${f.arquivo}`));
for (const f of presentes) copyFileSync(`${ORIGEM}/${f.arquivo}`, `public/fontes/${f.arquivo}`);
// Licenças acompanham as fontes publicadas.
for (const a of readdirSync(ORIGEM).filter((a) => /licen/i.test(a))) copyFileSync(`${ORIGEM}/${a}`, `public/fontes/${a}`);

const familias = new Set(presentes.map((f) => f.familia));
const reserva = { ui: 'monospace', 'ui-mono': 'monospace', leitura: 'sans-serif', codigo: 'monospace' };
const faces = presentes.map((f) =>
  `@font-face { font-family: '${f.familia}'; src: url('/fontes/${f.arquivo}') format('truetype'); font-weight: ${f.peso}; font-display: swap; }`);
const variaveis = Object.entries(manifesto.papeis)
  .filter(([, familia]) => familias.has(familia))
  .map(([papel, familia]) => `  --fonte-${papel}-terceiros: '${familia}', ${reserva[papel] ?? 'sans-serif'};`);

writeFileSync('src/estilos-gerados/fontes.css', `${faces.join('\n')}\n:root {\n${variaveis.join('\n')}\n}\n`);
console.log(`Fontes: ${presentes.length} arquivo(s) de terceiros.`);
