# jotanavarrete.github.io

Página personal CV/portfolio. **Astro 5 + Tailwind v4 + i18n (es/en)**, deploy estático a **GitHub Pages**.

🔗 https://jotanavarrete.github.io

## Stack

- [Astro 5](https://astro.build) — sitio estático, content collections, i18n nativo
- [Tailwind CSS v4](https://tailwindcss.com) — vía `@tailwindcss/vite` (sin `tailwind.config.js`)
- TypeScript strict
- GitHub Actions → GitHub Pages

## Desarrollo

```bash
npm install
npm run dev      # localhost:4321
npm run build    # build estático a dist/
npm run preview  # sirve el build local
```

## Estructura

```
src/
├── styles/global.css        # @import tailwindcss + @theme (tokens de diseño)
├── i18n/ui.ts               # labels UI + helpers de idioma
├── data/                    # experiencia por idioma (JSON tipado)
│   ├── experience.ts
│   ├── experience.es.json
│   └── experience.en.json
├── content.config.ts        # colección "blog" tipada (zod)
├── content/blog/{es,en}/    # posts en Markdown por idioma
├── layouts/BaseLayout.astro # SEO + Open Graph
├── components/              # Navbar, Hero, ExperienceCard, BlogCard, HobbyCard, Footer, LanguageSwitcher
└── pages/
    ├── index.astro          # redirect → /es/
    └── [lang]/              # genera /es y /en desde un solo set de páginas
```

## Internacionalización

- Locales `es` (default) y `en`, ambos prefijados: `/es/...`, `/en/...`.
- Las rutas comparten segmentos entre idiomas (`/es/experience` ↔ `/en/experience`); el selector de idioma solo cambia el prefijo y preserva la sección actual.

## Agregar contenido

**Experiencia** — editar `src/data/experience.{es,en}.json`. Cada entrada usa el mismo `id` en ambos idiomas; solo se traducen los textos.

**Blog** — crear un `.md` en `src/content/blog/es/` o `src/content/blog/en/`. El frontmatter `lang` debe reflejar la carpeta:

```yaml
---
title: 'Título'
description: 'Resumen'
pubDate: 2026-01-15
lang: 'es'
tags: ['astro']
draft: false
---
```

## Deploy

Push a `main` dispara el workflow `.github/workflows/deploy.yml` (build + deploy automático).

Configuración única: en **Settings → Pages**, poner **Source = GitHub Actions**.

## Contexto para Claude Code

Ver [`CLAUDE.md`](./CLAUDE.md) para decisiones de arquitectura y convenciones.
