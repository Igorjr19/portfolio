import pt from './pt.json';
import en from './en.json';

export type Chave = keyof typeof pt;
export type Idioma = 'pt' | 'en';
export const idiomas: Idioma[] = ['pt', 'en'];
export const idiomaPadrao: Idioma = 'pt';

// O inglês precisa ter exatamente as mesmas chaves do português.
const textos: Record<Idioma, Record<Chave, string>> = { pt, en: en satisfies Record<Chave, string> };

export function t(chave: Chave, idioma: Idioma = idiomaPadrao): string {
  return textos[idioma][chave];
}

// Seções e seus nomes de rota por idioma. Português na raiz, inglês sob /en/.
export const secoes = {
  sobre: { pt: 'sobre', en: 'about' },
  projetos: { pt: 'projetos', en: 'projects' },
  pesquisa: { pt: 'pesquisa', en: 'research' },
  blog: { pt: 'blog', en: 'blog' },
  cv: { pt: 'cv', en: 'cv' },
  contato: { pt: 'contato', en: 'contact' },
  sistema: { pt: 'sistema', en: 'system' },
} as const;

export type Secao = keyof typeof secoes;

export function rota(idioma: Idioma, secao?: Secao, slug?: string): string {
  const partes = [idioma === 'en' ? 'en' : '', secao ? secoes[secao][idioma] : '', slug ?? ''].filter(Boolean);
  return '/' + partes.join('/') + (partes.length ? '/' : '');
}
