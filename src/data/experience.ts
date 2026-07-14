import type { Lang } from '@/i18n/ui';
import esData from './experience.es.json';
import enData from './experience.en.json';

export interface ExperienceItem {
  /** Stable id, shared across languages to correlate entries. */
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location?: string;
  /** ISO date, e.g. "2022-03". */
  startDate: string;
  /** ISO date or null/omitted for "current". */
  endDate?: string | null;
  summary: string;
  highlights: string[];
  tags: string[];
}

const byLang: Record<Lang, ExperienceItem[]> = {
  es: esData as ExperienceItem[],
  en: enData as ExperienceItem[],
};

export function getExperience(lang: Lang): ExperienceItem[] {
  return byLang[lang] ?? byLang.es;
}
