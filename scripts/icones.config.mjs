// Ícones usados no sistema.
// paleta "cores": cada cor do desenho vira um índice (--ic-N), preenchido por tema.
// paleta "glifo": uma cor só, herda a cor do texto (currentColor).
// Os desenhos de terceiros ficam em terceiros/icones/ (fora do git), listados em
// terceiros/icones/icones.json. Sem eles, cada ícone vira um quadrado simples do mesmo tamanho.

export const icones = [
  { nome: 'pasta', paleta: 'cores', tamanho: 32 },
  { nome: 'documento', paleta: 'cores', tamanho: 32 },
  { nome: 'mensagem', paleta: 'cores', tamanho: 32 },
  { nome: 'paleta', paleta: 'cores', tamanho: 32 },
  { nome: 'pasta-16', paleta: 'cores', tamanho: 16 },
  { nome: 'documento-16', paleta: 'cores', tamanho: 16 },
  { nome: 'mensagem-16', paleta: 'cores', tamanho: 16 },
  { nome: 'paleta-16', paleta: 'cores', tamanho: 16 },
  { nome: 'bateria', paleta: 'glifo', tamanho: 16 },
  { nome: 'voltar', paleta: 'glifo', tamanho: 16 },
  { nome: 'inicio', paleta: 'glifo', tamanho: 16 },
  { nome: 'envelope', paleta: 'glifo', tamanho: 16 },
];

// Glifos desenhados para o sistema. 8 × 8, "#" = pixel.
export const desenhados = {
  fechar: [
    '##....##',
    '###..###',
    '.######.',
    '..####..',
    '..####..',
    '.######.',
    '###..###',
    '##....##',
  ],
  minimizar: [
    '........',
    '........',
    '........',
    '........',
    '........',
    '........',
    '######..',
    '######..',
  ],
  maximizar: [
    '########',
    '########',
    '#......#',
    '#......#',
    '#......#',
    '#......#',
    '#......#',
    '########',
  ],
};
