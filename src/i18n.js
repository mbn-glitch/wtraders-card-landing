import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import nl from "./locales/nl.json";

/* Only Dutch is bundled upfront. Other locales are code-split and
   loaded on demand when the user switches language. */
const loaders = {
  en: () => import("./locales/en.json"),
  ar: () => import("./locales/ar.json"),
  tr: () => import("./locales/tr.json"),
  fr: () => import("./locales/fr.json"),
  es: () => import("./locales/es.json"),
  pt: () => import("./locales/pt.json"),
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { nl: { translation: nl } },
    fallbackLng: "nl",
    supportedLngs: ["nl", "en", "ar", "tr", "fr", "es", "pt"],
    load: "languageOnly",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    react: { useSuspense: false },
  });

const loaded = new Set(["nl"]);

async function ensureLoaded(lng) {
  if (loaded.has(lng) || !loaders[lng]) return;
  const mod = await loaders[lng]();
  i18n.addResourceBundle(lng, "translation", mod.default, true, true);
  loaded.add(lng);
}

/* Public API: load the bundle FIRST, then switch the language.
   This guarantees React re-renders with translated strings, not stale ones. */
export async function changeLanguageSafely(lng) {
  if (lng === i18n.language) return;
  await ensureLoaded(lng);
  await i18n.changeLanguage(lng);
}

/* Load the detected language at startup if it isn't already bundled.
   We don't await here because startup shouldn't block — the bundled
   language renders first, then the detected language swaps in. */
if (i18n.language && !loaded.has(i18n.language) && loaders[i18n.language]) {
  ensureLoaded(i18n.language).then(() => {
    /* Force re-render after async load by re-emitting languageChanged */
    i18n.emit("languageChanged", i18n.language);
  });
}

export default i18n;

export const LANGUAGES = [
  { code: "nl", label: "Nederlands", native: "NL", flag: "🇳🇱" },
  { code: "en", label: "English", native: "EN", flag: "🇬🇧" },
  { code: "ar", label: "العربية", native: "عربي", flag: "🇸🇦" },
  { code: "tr", label: "Türkçe", native: "TR", flag: "🇹🇷" },
  { code: "fr", label: "Français", native: "FR", flag: "🇫🇷" },
  { code: "es", label: "Español", native: "ES", flag: "🇪🇸" },
  { code: "pt", label: "Português", native: "PT", flag: "🇧🇷" },
];
