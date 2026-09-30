# igorj.dev

Site pessoal de Ígor José Rodrigues: portfólio, blog e currículo apresentados como um sistema operacional fictício do começo dos anos 2000. No computador, uma área de trabalho com janelas; no celular, um smartphone do mesmo sistema.

Em desenvolvimento. O site anterior continua em [igorj.dev.br](https://igorj.dev.br) até o lançamento.

## Rodar

Requer Node.js e npm.

```
npm install
npm run dev            # gera os ícones e abre em http://localhost:4321
npm run build          # build de produção, com as verificações
npm run build:exemplo  # build aceitando conteúdo de exemplo (prévias)
npm run contraste      # auditoria de contraste dos temas
npm run check          # checagem de tipos
```

O conteúdo vem da pasta indicada em `CONTEUDO_DIR` (padrão: `./conteudo`, uma cópia local do repositório de conteúdo, que é privado). No build do Cloudflare, `CONTEUDO_REPO` e `CONTEUDO_TOKEN` fazem o build baixar esse repositório antes de começar. O build de produção falha se encontrar conteúdo de exemplo (`exemplo: true` ou `[EXEMPLO]`), contraste abaixo do mínimo ou token faltando num tema. Para prévias com conteúdo de exemplo, defina `PERMITIR_EXEMPLO=1`.

## Versão simples

Toda rota é uma página HTML completa, legível sem JavaScript. Com JavaScript, a casca do sistema aparece por cima. `?simples=1` na URL grava a preferência pela versão simples; `?simples=0` volta para as janelas.

## Parâmetros de URL para testes

Valem só na visita e passam na frente do que está salvo no navegador.

| Parâmetro | Valores |
|---|---|
| `simples` | `1` (versão simples), `0` (janelas) |
| `abrir` | `projetos`, `curriculo`, `contato`, `aparencia` |
| `tema` | `automatico`, `padrao` ou o nome de outro tema presente |
| `modo` | `auto`, `computador`, `celular` |
| `escala` | `auto`, `1`, `2`, `3` |
| `densidade` | `sim`, `nao` |
| `gradiente` | `liso`, `faixas` |

Exemplo: `/?tema=padrao&abrir=aparencia`.

## Estrutura

| Caminho | Conteúdo |
|---|---|
| `src/temas/tokens.json` | Tokens de cor e a função de cada um |
| `src/temas/*.json` | Um arquivo por tema; o build falha se faltar token |
| `src/lib/temas.ts` | CSS dos temas e regra do tema inicial (segue o navegador até o visitante escolher) |
| `scripts/indexar-icones.mjs` | Converte os ícones PNG em SVG com cores indexadas |
| `scripts/fontes.mjs` | Prepara as fontes, quando presentes |
| `scripts/contraste.mjs` | Auditoria de contraste (texto 4,5:1, controles 3:1) |
| `src/content.config.ts` | Coleções e esquemas do conteúdo |
| `src/lib/rotas.ts` | Todas as rotas, nos dois idiomas |
| `src/components/paginas/` | Páginas sem casca |
| `src/i18n/` | Textos da interface e nomes das rotas por idioma |
| `scripts/verificar.mjs` | Verificações que rodam antes do build |
| `src/scripts/sistema.ts` | Janelas, barra de tarefas, menu, celular, tema e escala |
O conteúdo (textos, projetos, currículo) fica em repositório separado.

## Materiais de terceiros

Ícones, fontes e paletas de terceiros não fazem parte deste repositório. Quando presentes na pasta local `terceiros/`, o build os usa e mostra os créditos na tela de Aparência. Sem eles, o site funciona com as fontes do sistema, ícones substitutos e apenas o tema padrão.

## Licença

Código sob a licença MIT (ver `LICENSE`).
