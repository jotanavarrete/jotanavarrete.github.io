// Central place for UI strings + i18n helpers.
// Content (experience, blog) lives in data/ and content/ per language;
// this file is only for interface labels (navbar, buttons, etc.).

export const languages = {
  es: 'Español',
  en: 'English',
} as const;

export const defaultLang = 'es';

export type Lang = keyof typeof languages;

// UI labels per language. Add keys as the UI grows.
export const ui = {
  es: {
    'nav.home': 'Inicio',
    'nav.experience': 'Experiencia',
    'nav.blog': 'Blog',
    'nav.hobbies': 'Hobbies',
    'hero.cta': 'Ver experiencia',
    'hero.title': 'Hola, soy Javier.',
    'hero.role': 'Data Engineer',
    'hero.lead':
      'Diseño y construyo pipelines de datos confiables y escalables. Convierto datos crudos en decisiones que el negocio realmente puede usar.',
    'hero.ctaPrimary': 'Ver experiencia',
    'hero.ctaSecondary': 'Contáctame',
    'hero.photoPlaceholder': 'foto de perfil',
    'exp.kicker': 'Trayectoria',
    'exp.title': 'Experiencia laboral',
    'exp.sub': 'Dónde he trabajado y qué construí.',
    'blog.kicker': 'Escritos',
    'blog.title': 'Desde el blog',
    'blog.sub': 'Notas sobre ingeniería y arquitectura de datos.',
    'blog.readMore': 'Leer artículo',
    'blog.backToList': 'Volver al blog',
    'personal.kicker': 'Fuera del trabajo',
    'personal.title': 'Un poco de mí',
    'personal.sub': 'Lo que me mantiene con curiosidad lejos del teclado.',
    'contact.title': 'Construyamos algo con tus datos.',
    'contact.sub':
      'Estoy abierto a proyectos, colaboraciones o simplemente charlar sobre pipelines.',
    'contact.cta': 'Escríbeme',
    'contact.builtWith': 'Hecho con Astro + Tailwind',
    'footer.rights': 'Todos los derechos reservados.',
  },
  en: {
    'nav.home': 'Home',
    'nav.experience': 'Experience',
    'nav.blog': 'Blog',
    'nav.hobbies': 'Hobbies',
    'hero.cta': 'See experience',
    'hero.title': "Hi, I'm Javier.",
    'hero.role': 'Data Engineer',
    'hero.lead':
      'I design and build reliable, scalable data pipelines. I turn raw data into decisions the business can actually use.',
    'hero.ctaPrimary': 'View experience',
    'hero.ctaSecondary': 'Get in touch',
    'hero.photoPlaceholder': 'profile photo',
    'exp.kicker': 'Career',
    'exp.title': 'Work experience',
    'exp.sub': 'Where I have worked and what I built.',
    'blog.kicker': 'Writing',
    'blog.title': 'From the blog',
    'blog.sub': 'Notes on data engineering and architecture.',
    'blog.readMore': 'Read article',
    'blog.backToList': 'Back to blog',
    'personal.kicker': 'Off the clock',
    'personal.title': 'A bit about me',
    'personal.sub': 'What keeps me curious away from the keyboard.',
    'contact.title': "Let's build something with your data.",
    'contact.sub': 'Open to projects, collaborations, or just chatting about pipelines.',
    'contact.cta': 'Say hello',
    'contact.builtWith': 'Built with Astro + Tailwind',
    'footer.rights': 'All rights reserved.',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UIKey = keyof (typeof ui)[typeof defaultLang];

/** Extract the language from a URL like /es/blog -> 'es'. */
export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

/** Returns a translator function bound to a language. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/**
 * Given the current URL, return the equivalent path in another language.
 * Routes share the same segments across locales (only the /es or /en prefix
 * changes), so switching language preserves the current section.
 */
export function switchLanguagePath(url: URL, targetLang: Lang, base = '/'): string {
  const parts = url.pathname.split('/').filter(Boolean);
  // First segment is the current lang prefix; replace it.
  if (parts.length && parts[0] in ui) {
    parts[0] = targetLang;
  } else {
    parts.unshift(targetLang);
  }
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${parts.join('/')}`.replace(/\/+/g, '/');
}
