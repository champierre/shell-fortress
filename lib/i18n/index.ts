import { Locale, UITranslations, StageTranslations } from "./types";
import * as en from "./en";
import * as ja from "./ja";

const translations: Record<Locale, { ui: UITranslations; stages: Record<string, StageTranslations> }> = {
  en: { ui: en.ui, stages: en.stages },
  ja: { ui: ja.ui, stages: ja.stages },
};

export function detectLocale(): Locale {
  if (typeof window === "undefined") return "en";

  const stored = localStorage.getItem("shell-fortress-locale");
  if (stored === "en" || stored === "ja") return stored;

  const browserLang = navigator.language || "";
  if (browserLang.startsWith("ja")) return "ja";

  return "en";
}

export function getUI(locale: Locale): UITranslations {
  return translations[locale].ui;
}

export function getStageTranslation(locale: Locale, stageId: string): StageTranslations | undefined {
  return translations[locale].stages[stageId];
}

export type { Locale, UITranslations, StageTranslations };
