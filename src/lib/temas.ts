// Monta o CSS dos temas.
// O tema padrão (cores próprias) fica em src/temas/padrao.json. Outros temas, que usam paletas de
// terceiros, ficam em terceiros/temas/ (fora do git) e entram só se existirem.
// Regra da primeira visita: sem escolha salva, segue o navegador (tema escuro, se houver);
// com escolha salva (data-tema no <html>), a escolha vale.

import tokens from '../temas/tokens.json';
import padrao from '../temas/padrao.json';
import { t, type Idioma } from '../i18n';

type ArquivoTema = { nome: string; rotulo?: Record<Idioma, string>; escuro?: boolean; cores: Record<string, string> };
export type Tema = ArquivoTema & { icones: Record<string, string> };

const extras = Object.values(import.meta.glob<ArquivoTema>('../../terceiros/temas/*.json', { eager: true, import: 'default' }));
const mapasIcones = import.meta.glob<Record<string, string>>('../temas/gerado/icones-*.json', { eager: true, import: 'default' });
const iconesDe = (nome: string) => mapasIcones[`../temas/gerado/icones-${nome}.json`] ?? {};

export const temas: Tema[] = [padrao as ArquivoTema, ...extras].map((a) => ({ ...a, icones: iconesDe(a.nome) }));
const claro = temas[0];
const escuro = temas.find((t) => t.escuro);

const nomesTokens = Object.keys(tokens);
const nomesIndices = Object.keys(iconesDe(claro.nome));

// Todo tema preenche todos os tokens e todos os índices de ícone.
for (const tema of temas) {
  const faltam = [
    ...nomesTokens.filter((n) => !(n in tema.cores)),
    ...nomesIndices.filter((i) => !(i in tema.icones)),
  ];
  if (faltam.length) throw new Error(`Tema "${tema.nome}" sem: ${faltam.join(', ')}`);
}

export function rotuloDoTema(tema: Tema, idioma: Idioma): string {
  return tema.rotulo?.[idioma] ?? t('aparencia.padrao', idioma);
}

const declaracoes = (tema: Tema) =>
  [...Object.entries(tema.cores), ...Object.entries(tema.icones)].map(([nome, valor]) => `--${nome}:${valor};`).join('');
const esquema = (tema: Tema) => (tema.escuro ? 'dark' : 'light');

export function cssDosTemas(): string {
  const indices = nomesIndices.map((i) => `.ico .i${i.slice(3)}{fill:var(--${i})}`).join('');
  return [
    `:root{color-scheme:light;${declaracoes(claro)}}`,
    escuro ? `@media (prefers-color-scheme: dark){:root:not([data-tema]){color-scheme:dark;${declaracoes(escuro)}}}` : '',
    ...temas.map((tema) => `:root[data-tema="${tema.nome}"]{color-scheme:${esquema(tema)};${declaracoes(tema)}}`),
    indices,
  ].join('\n');
}
