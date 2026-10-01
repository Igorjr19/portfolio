# igorj.dev

Personal site of Ígor José Rodrigues: portfolio, blog and CV on a page that behaves like a terminal UI, with bordered panels, keyboard shortcuts and terminal color schemes. Every piece of content is in the HTML; JavaScript only adds shortcuts and theme switching.

Work in progress. The previous site stays at [igorj.dev.br](https://igorj.dev.br) until launch.

## Tooling

[mise](https://mise.jdx.dev) installs the pinned versions of every tool listed in `mise.toml`:

- [Hugo](https://gohugo.io) builds the site.
- [Deno](https://deno.com) runs the build tools, type checks and tests, and installs the CSS and font packages.
- [Biome](https://biomejs.dev) formats and lints TypeScript, CSS and JSON.
- [Lefthook](https://lefthook.dev) runs the checks on commit and push.
- [actionlint](https://github.com/rhysd/actionlint) checks the GitHub Actions workflow.

```sh
mise install
deno task hooks          # install the git hooks (once)
deno task dev            # local server at http://localhost:1313
deno task build          # production build
deno task ci             # everything the CI runs
```

| Task | What it does |
|---|---|
| `lint` | Biome and actionlint |
| `format` | Applies Biome formatting and safe fixes |
| `typecheck` | `deno check` over tools, tests and browser code |
| `test` | Unit tests |
| `test:e2e` | Builds the fixture site and runs browser tests |
| `build:fixtures` | Builds the site from `tests/fixtures/content` |

## Content

Posts, projects, research and CV live in a separate private repository. The build reads `content/`, a local clone of it; `deno task content:fetch` clones it when `CONTENT_REPO` and `CONTENT_TOKEN` are set.

The production build fails on example content (`example: true` or `[EXAMPLE]`). Set `ALLOW_EXAMPLE_CONTENT=1` for previews.

## Themes and fonts

Each theme is a terminal color scheme: 16 ANSI colors plus background, foreground, cursor and selection. A manifest in `data/themes/` points at the palette published by its authors, pinned by commit and checksum, and maps palette colors to interface roles (`data/theme-defaults.toml` holds the default mapping). The build downloads each palette, audits contrast (4.5:1 for text, 3:1 for focus and borders) and fails below the minimum. Adding a theme means adding a manifest.

Without a saved choice, the theme follows the system light or dark preference. A saved choice is applied before the first paint.

Fonts come from Fontsource packages; `data/fonts.toml` lists families, weights, styles and subsets, and the build generates the `@font-face` rules and copies only those files.

## Structure

| Path | Contents |
|---|---|
| `assets/css/` | Styles in cascade layers: WebTUI first, then `app.tokens`, `app.base`, `app.layout`, `app.components` |
| `assets/ts/` | Browser TypeScript, bundled by Hugo |
| `layouts/` | Hugo templates and partials |
| `i18n/` | Interface text per language |
| `data/` | Theme and font manifests |
| `tools/` | Build tools: pure modules by domain, command-line entry points in `tools/cli/` |
| `tests/unit/` | Unit tests, mirroring `tools/` |
| `tests/e2e/` | Browser tests against the fixture site |
| `tests/fixtures/` | Fixture content and the Hugo config that uses it |
| `generated/` | Build output consumed by Hugo (not versioned) |

## CI and deployment

GitHub Actions runs lint, type checks and unit tests, then the browser tests, and only then builds with the real content and deploys to Cloudflare Pages with Wrangler. Pushes to `main` deploy to production; other branches deploy previews. The content repository can trigger a rebuild with a `content-updated` repository dispatch.

Required repository settings: secrets `CONTENT_TOKEN`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`; variables `CONTENT_REPO`, `CLOUDFLARE_PAGES_PROJECT`, and `ALLOW_EXAMPLE_CONTENT` until the real content is in place.

## Third-party material

No third-party files are versioned. Packages are pinned in `deno.json` and `deno.lock`. The interface builds on [WebTUI](https://github.com/webtui/webtui) (MIT) without changes; adjustments live in the site's own layers. Fonts: [Fira Code](https://github.com/tonsky/FiraCode) and [Fira Sans](https://github.com/mozilla/Fira) (SIL OFL 1.1) via Fontsource. Palettes: [Catppuccin](https://catppuccin.com) (MIT), fetched from [iTerm2-Color-Schemes](https://github.com/mbadolato/iTerm2-Color-Schemes) (MIT).

## License

Code under the MIT license (see `LICENSE`).
