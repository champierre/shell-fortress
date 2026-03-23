"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Locale, UITranslations, StageTranslations, detectLocale, getUI, getStageTranslation } from ".";

interface I18nContextType {
  locale: Locale;
  t: UITranslations;
  stageT: (stageId: string) => StageTranslations | undefined;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(detectLocale());
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("shell-fortress-locale", newLocale);
  }, []);

  const t = getUI(locale);
  const stageT = useCallback(
    (stageId: string) => getStageTranslation(locale, stageId),
    [locale]
  );

  if (!mounted) return null;

  return (
    <I18nContext.Provider value={{ locale, t, stageT, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
