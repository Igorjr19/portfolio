// Baixa o repositório privado de conteúdo antes do build, quando CONTEUDO_REPO está definido
// (no Cloudflare Pages). Localmente, a pasta conteudo/ já existe e nada é baixado.
//   CONTEUDO_REPO   dono/nome do repositório no GitHub
//   CONTEUDO_TOKEN  token de acesso só de leitura ao conteúdo desse repositório
//   CONTEUDO_REF    branch ou tag (opcional; padrão: branch principal)

import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const repo = process.env.CONTEUDO_REPO;
const destino = process.env.CONTEUDO_DIR ?? 'conteudo';

if (!repo) {
  if (!existsSync(destino)) {
    console.error(`Sem conteúdo: a pasta ${destino}/ não existe e CONTEUDO_REPO não está definido.`);
    process.exit(1);
  }
  process.exit(0);
}

if (existsSync(destino)) {
  console.log(`Conteúdo já presente em ${destino}/; nada a baixar.`);
  process.exit(0);
}

const token = process.env.CONTEUDO_TOKEN;
if (!token) {
  console.error('CONTEUDO_REPO definido sem CONTEUDO_TOKEN.');
  process.exit(1);
}

const args = ['clone', '--depth', '1'];
if (process.env.CONTEUDO_REF) args.push('--branch', process.env.CONTEUDO_REF);
args.push(`https://x-access-token:${token}@github.com/${repo}.git`, destino);

// Saída do git suprimida para o token nunca aparecer no log.
const r = spawnSync('git', args, { stdio: 'ignore' });
if (r.status !== 0) {
  console.error(`Falha ao baixar o conteúdo de ${repo}. Confira o token e o nome do repositório.`);
  process.exit(1);
}
console.log(`Conteúdo baixado de ${repo}.`);
