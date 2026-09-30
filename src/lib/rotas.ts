// Todas as rotas do site, nos dois idiomas. Usado pelo getStaticPaths da página única.

import { idiomas, rota, secoes, type Idioma, type Secao } from '../i18n';
import { itens } from './conteudo';

export type Colecao = 'projetos' | 'pesquisa' | 'posts';
export const secaoDaColecao: Record<Colecao, Secao> = { projetos: 'projetos', pesquisa: 'pesquisa', posts: 'blog' };

export type Pagina =
  | { tipo: 'inicio'; idioma: Idioma; alternativas: Partial<Record<Idioma, string>> }
  | { tipo: 'secao'; idioma: Idioma; secao: Secao; alternativas: Partial<Record<Idioma, string>> }
  | { tipo: 'item'; idioma: Idioma; colecao: Colecao; pasta: string; alternativas: Partial<Record<Idioma, string>> };

const semBarras = (href: string) => href.replace(/^\/|\/$/g, '') || undefined;

export async function todasAsRotas() {
  const rotas: { params: { caminho: string | undefined }; props: Pagina }[] = [];

  for (const idioma of idiomas) {
    const alt = (f: (i: Idioma) => string) => Object.fromEntries(idiomas.map((i) => [i, f(i)]));

    rotas.push({ params: { caminho: semBarras(rota(idioma)) }, props: { tipo: 'inicio', idioma, alternativas: alt((i) => rota(i)) } });

    for (const secao of Object.keys(secoes) as Secao[]) {
      rotas.push({
        params: { caminho: semBarras(rota(idioma, secao)) },
        props: { tipo: 'secao', idioma, secao, alternativas: alt((i) => rota(i, secao)) },
      });
    }

    for (const colecao of Object.keys(secaoDaColecao) as Colecao[]) {
      const secao = secaoDaColecao[colecao];
      for (const item of await itens(colecao, idioma)) {
        // Cada idioma aponta para o slug da própria versão; sem versão, para o slug do item mostrado.
        const alternativas = Object.fromEntries(idiomas.map((i) => {
          const versao = item.versoes.find((v) => v.idioma === i) ?? item;
          return [i, rota(i, secao, versao.slug)];
        }));
        rotas.push({
          params: { caminho: semBarras(rota(idioma, secao, item.slug)) },
          props: { tipo: 'item', idioma, colecao, pasta: item.pasta, alternativas },
        });
      }
    }
  }

  // Dois itens não podem gerar o mesmo endereço.
  const vistos = new Set<string>();
  for (const r of rotas) {
    const chave = r.params.caminho ?? '';
    if (vistos.has(chave)) throw new Error(`Rota duplicada: /${chave}`);
    vistos.add(chave);
  }
  return rotas;
}

// Converte um "abre" do conteúdo (rota em português, ex.: "/projetos") para o idioma da página.
export function resolverAbre(abre: string, idioma: Idioma): string {
  const [primeiro, ...resto] = abre.replace(/^\/|\/$/g, '').split('/');
  const secao = (Object.keys(secoes) as Secao[]).find((s) => secoes[s].pt === primeiro);
  return secao ? rota(idioma, secao, resto.join('/') || undefined) : abre;
}
