// Acesso ao conteúdo: pasta, idioma e slug de cada item a partir do identificador.
// Identificador "agenda-de-salas/index.pt": a pasta identifica o item, o idioma vem do nome do arquivo,
// e o slug vem do frontmatter ou, sem ele, do nome da pasta. Arquivos da mesma pasta são traduções.

import { getCollection, type CollectionEntry } from 'astro:content';
import type { Idioma } from '../i18n';

type ComPasta = 'posts' | 'projetos' | 'pesquisa';

export type Item<C extends ComPasta> = {
  entrada: CollectionEntry<C>;
  pasta: string;
  idioma: Idioma;
  slug: string;
};

function descrever<C extends ComPasta>(entrada: CollectionEntry<C>): Item<C> {
  const [pasta, arquivo] = entrada.id.split('/');
  const idioma = arquivo.split('.')[1] as Idioma;
  if (idioma !== entrada.data.idioma) {
    throw new Error(`${entrada.collection}/${entrada.id}: idioma do arquivo (${idioma}) diferente do frontmatter (${entrada.data.idioma})`);
  }
  return { entrada, pasta, idioma, slug: entrada.data.slug ?? pasta };
}

// Itens de uma coleção num idioma. Sem tradução, o item aparece no outro idioma.
export async function itens<C extends ComPasta>(colecao: C, idioma: Idioma) {
  const todos = (await getCollection(colecao)).map((e) => descrever(e as CollectionEntry<C>));
  const visiveis = todos.filter((i) => !('rascunho' in i.entrada.data && i.entrada.data.rascunho));
  const porPasta = new Map<string, Item<C>[]>();
  for (const i of visiveis) porPasta.set(i.pasta, [...(porPasta.get(i.pasta) ?? []), i]);
  return [...porPasta.values()].map((versoes) => {
    const escolhido = versoes.find((v) => v.idioma === idioma) ?? versoes[0];
    return { ...escolhido, traduzido: escolhido.idioma === idioma, versoes };
  });
}

// Arquivos de dados com idioma no nome: "cv.pt", "conversa.en". Sem o idioma pedido, usa o português.
export async function dadoPorIdioma<C extends 'cv' | 'conversa'>(colecao: C, idioma: Idioma) {
  const todos = await getCollection(colecao);
  const achado = todos.find((e) => e.id.endsWith(`.${idioma}`)) ?? todos.find((e) => e.id.endsWith('.pt'));
  if (!achado) throw new Error(`Coleção ${colecao} sem arquivo em português`);
  return { entrada: achado, traduzido: achado.id.endsWith(`.${idioma}`) };
}
