import type { Chave } from '../i18n';

export type App = {
  id: string;
  titulo: Chave;
  icone: string;
  // Atalho obrigatório na área de trabalho: visível sem abrir o menu iniciar.
  atalho: boolean;
};

export const apps: App[] = [
  { id: 'projetos', titulo: 'app.projetos', icone: 'pasta', atalho: true },
  { id: 'curriculo', titulo: 'app.curriculo', icone: 'documento', atalho: true },
  { id: 'contato', titulo: 'app.contato', icone: 'mensagem', atalho: true },
  { id: 'aparencia', titulo: 'app.aparencia', icone: 'paleta', atalho: true },
];
