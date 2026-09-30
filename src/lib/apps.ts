import type { Chave, Secao } from '../i18n';

export type App = {
  id: string;
  titulo: Chave;
  icone: string;
  // Seção do site que o app mostra: todo app tem rota própria.
  secao: Secao;
  // Atalho obrigatório na área de trabalho: visível sem abrir o menu iniciar.
  atalho: boolean;
  // Grupo no menu iniciar.
  grupo: 'conteudo' | 'sistema';
};

// Ícones provisórios: vários apps compartilham os mesmos até a revisão dos ícones.
export const apps: App[] = [
  { id: 'sobre', titulo: 'secao.sobre', icone: 'mensagem', secao: 'sobre', atalho: false, grupo: 'conteudo' },
  { id: 'projetos', titulo: 'secao.projetos', icone: 'pasta', secao: 'projetos', atalho: true, grupo: 'conteudo' },
  { id: 'pesquisa', titulo: 'secao.pesquisa', icone: 'pasta', secao: 'pesquisa', atalho: false, grupo: 'conteudo' },
  { id: 'blog', titulo: 'secao.blog', icone: 'documento', secao: 'blog', atalho: false, grupo: 'conteudo' },
  { id: 'curriculo', titulo: 'secao.cv', icone: 'documento', secao: 'cv', atalho: true, grupo: 'conteudo' },
  { id: 'contato', titulo: 'secao.contato', icone: 'mensagem', secao: 'contato', atalho: true, grupo: 'conteudo' },
  { id: 'aparencia', titulo: 'secao.aparencia', icone: 'paleta', secao: 'aparencia', atalho: true, grupo: 'sistema' },
  { id: 'sistema', titulo: 'secao.sistema', icone: 'paleta', secao: 'sistema', atalho: false, grupo: 'sistema' },
];
