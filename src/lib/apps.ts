import type { Chave, Secao } from '../i18n';

export type App = {
  id: string;
  titulo: Chave;
  icone: string;
  // Atalho obrigatório na área de trabalho: visível sem abrir o menu iniciar.
  atalho: boolean;
  // Seção do site que o app mostra. Sem seção, o app só existe dentro da casca.
  secao?: Secao;
};

export const apps: App[] = [
  { id: 'projetos', titulo: 'app.projetos', icone: 'pasta', atalho: true, secao: 'projetos' },
  { id: 'curriculo', titulo: 'app.curriculo', icone: 'documento', atalho: true, secao: 'cv' },
  { id: 'contato', titulo: 'app.contato', icone: 'mensagem', atalho: true, secao: 'contato' },
  { id: 'aparencia', titulo: 'app.aparencia', icone: 'paleta', atalho: true },
];
