import { defineConfig } from 'astro/config';

export default defineConfig({
  markdown: {
    // Cores do realce de código vêm de variáveis CSS, ligadas aos tokens do tema em pagina.css.
    shikiConfig: { theme: 'css-variables' },
  },
});
