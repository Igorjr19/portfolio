// Travas do build. Roda antes do astro build.
// 1. Conteúdo de exemplo: recusado, a menos que PERMITIR_EXEMPLO=1 (prévias e testes).
// 2. Contraste dos temas abaixo do mínimo.
// (Token faltando num tema já derruba o build em src/lib/temas.ts.)

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const pasta = resolve(process.env.CONTEUDO_DIR ?? './conteudo');
const permitirExemplo = process.env.PERMITIR_EXEMPLO === '1';

function arquivos(dir) {
  return readdirSync(dir).flatMap((nome) => {
    const caminho = join(dir, nome);
    return statSync(caminho).isDirectory() ? arquivos(caminho) : [caminho];
  });
}

const comExemplo = arquivos(pasta)
  .filter((a) => /\.(md|ya?ml)$/.test(a) && !a.endsWith('README.md'))
  .filter((a) => {
    const texto = readFileSync(a, 'utf8');
    return /^exemplo:\s*true\s*$/m.test(texto) || texto.includes('[EXEMPLO]');
  })
  .map((a) => relative(pasta, a));

let falhou = false;

if (comExemplo.length) {
  const lista = comExemplo.map((a) => `  - ${a}`).join('\n');
  if (permitirExemplo) {
    console.warn(`Aviso: ${comExemplo.length} arquivo(s) de conteúdo de exemplo (permitido por PERMITIR_EXEMPLO=1):\n${lista}`);
  } else {
    console.error(`Conteúdo de exemplo encontrado em ${pasta}:\n${lista}\nUse conteúdo real ou defina PERMITIR_EXEMPLO=1 para prévias.`);
    falhou = true;
  }
}

const contraste = spawnSync(process.execPath, ['scripts/contraste.mjs'], { encoding: 'utf8' });
if (contraste.status !== 0) {
  console.error(contraste.stdout.split('\n').filter((l) => l.includes('FALHA')).join('\n'));
  console.error('Contraste abaixo do mínimo.');
  falhou = true;
}

if (falhou) process.exit(1);
console.log('Verificações do build: ok.');
