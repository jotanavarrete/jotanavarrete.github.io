# CLAUDE.md

Contexto de proyecto para Claude Code. Léelo al iniciar sesión.

## Qué es

Página personal CV/portfolio. **Astro 5 + Tailwind v4 + i18n nativo**, deploy estático a **GitHub Pages**.

Repo `jotanavarrete.github.io` = user page → `base: '/'`, `site: 'https://jotanavarrete.github.io'`.
(Si fuera repo de proyecto, `base` sería `/<repo>`.)

## Comandos

```bash
npm run dev      # localhost:4321
npm run build    # build estático a dist/ (corre content sync + type gen)
npm run preview  # sirve el build
```

Verificar cambios: `npm run build` debe pasar antes de dar por terminado.

## Stack y decisiones

- **Tailwind v4** vía `@tailwindcss/vite` (NO hay `tailwind.config.js`). Tokens de diseño van en `src/styles/global.css` dentro de `@theme`.
- **i18n**: locales `['es','en']`, default `es`, `prefixDefaultLocale: true` → ambos idiomas prefijados (`/es/...`, `/en/...`).
- **Rutas comparten segmentos entre idiomas** (`/es/experience` ↔ `/en/experience`). Regla clave: NO traducir los segmentos de URL. `LanguageSwitcher` solo cambia el prefijo `/es|/en` para preservar la sección. Si en el futuro se quieren slugs traducidos, hay que reescribir el switcher.
- **Segmento dinámico `[lang]`**: un solo set de páginas en `src/pages/[lang]/` genera ambos idiomas vía `getStaticPaths`. No duplicar páginas por idioma.
- **TypeScript strict**, alias `@/*` → `src/*`.
- **Diseño visual**: se integra desde Claude Design. Componentes actuales son estructura placeholder con Tailwind mínimo; el markup/estilo final reemplaza su contenido, la lógica se mantiene.

## Estructura

```
src/
├── styles/global.css        # @import tailwindcss + @theme (tokens de diseño aquí)
├── i18n/ui.ts               # labels UI + helpers: getLangFromUrl, useTranslations(t), switchLanguagePath
├── data/
│   ├── experience.ts        # tipo ExperienceItem + getExperience(lang)
│   ├── experience.es.json
│   └── experience.en.json
├── content.config.ts        # colección "blog" tipada con zod
├── content/blog/{es,en}/*.md
├── layouts/BaseLayout.astro # SEO + Open Graph + Twitter cards
├── components/              # Navbar, Hero, ExperienceCard, BlogCard, HobbyCard, Footer, LanguageSwitcher
└── pages/
    ├── index.astro          # redirect → /es/
    └── [lang]/{index,experience,hobbies}.astro + blog/{index,[...slug]}.astro
```

## Cómo agregar contenido

**Experiencia** — 2 JSON espejo (`experience.es.json` / `.en.json`). Cada entrada usa el mismo `id` en ambos idiomas para correlacionar. Campos neutros (fechas, tags, `companyUrl`) se repiten; solo los textos se traducen. Tipado en `data/experience.ts`.

**Blog** — carpeta = idioma. `src/content/blog/es/mi-post.md` → `/es/blog/mi-post`. El frontmatter `lang` debe reflejar la carpeta. Schema valida `title, description, pubDate, lang, tags, heroImage?, draft`. El slug de URL se deriva quitando el prefijo `<lang>/` del id. Posts son independientes por idioma (no requiere paridad). Para vincular un post con su traducción, agregar `translationKey` al schema.

**Hobbies** — inline por idioma en `pages/[lang]/hobbies.astro`. Mover a `data/hobbies.<lang>.json` si crece.

**Labels de UI** (navbar, botones) — en `src/i18n/ui.ts`, objeto `ui`. NO poner contenido (experiencia/blog) ahí.

## Deploy

- `.github/workflows/deploy.yml`: build + deploy a Pages en push a `main` (usa `withastro/action@v3` + `actions/deploy-pages@v4`).
- Requisito una sola vez: en Settings → Pages del repo, **Source = GitHub Actions**.

## Pendientes / notas

- `BaseLayout` referencia `public/og-default.png` (aún no existe) — crear imagen OG real.
- Falta integrar el diseño final de Claude Design.
- Optimización de imágenes: usar `<Image>` de `astro:assets` cuando haya imágenes reales.

## Estilo de trabajo

Respuestas estilo "smart caveman": sin relleno, fragmentos ok, términos técnicos exactos, bloques de código intactos. (Ver `~/.claude/CLAUDE.md`.)
