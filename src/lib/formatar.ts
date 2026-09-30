import type { Idioma } from '../i18n';

const localidade = (idioma: Idioma) => (idioma === 'pt' ? 'pt-BR' : 'en');

export function data(valor: Date, idioma: Idioma): string {
  return valor.toLocaleDateString(localidade(idioma), { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

// "2025-03" -> "mar. de 2025" / "Mar 2025"
export function anoMes(valor: string, idioma: Idioma): string {
  const [ano, mes] = valor.split('-').map(Number);
  return new Date(Date.UTC(ano, mes - 1, 1)).toLocaleDateString(localidade(idioma), { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function periodo(inicio: string | null | undefined, fim: string | null | undefined, atual: string, idioma: Idioma): string {
  if (!inicio) return '';
  return `${anoMes(inicio, idioma)} – ${fim ? anoMes(fim, idioma) : atual}`;
}
