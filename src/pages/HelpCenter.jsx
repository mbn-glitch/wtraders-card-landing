import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, LifeBuoy, ArrowLeft } from "lucide-react";
import Fuse from "fuse.js";
import { getCategories } from "../data/helpCenterData";
import useDirection from "../hooks/useDirection";
import LanguageSwitcher from "../components/LanguageSwitcher";
import WhatsAppButton from "../components/WhatsAppButton";
import StickyMobileCTA from "../components/StickyMobileCTA";

const WHATSAPP_URL = "https://wa.me/971504868995?text=Hello%2C%20I%20need%20help%20with%20my%20Wtraders%20Card";
const RECENT_KEY = "wtraders_recent_searches";

function WhatsAppIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function AccordionItem({ faq, isOpen, onToggle }) {
  return (
    <div className={`relative rounded-2xl transition-all duration-500 ${isOpen ? "bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-amber-500/20 p-px shadow-[0_0_30px_-5px_rgba(201,169,97,0.15)]" : "bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-white/[0.06] p-px"}`}>
      <div className={`rounded-2xl transition-all duration-500 ${isOpen ? "bg-gradient-to-b from-amber-500/[0.05] to-black/95" : "bg-black/90 hover:bg-white/[0.02]"}`}>
        <button onClick={onToggle} className="flex w-full items-center justify-between px-6 py-5 text-start group" aria-expanded={isOpen}>
          <span className={`text-sm font-medium pe-6 transition-colors duration-300 sm:text-base ${isOpen ? "text-white" : "text-zinc-300 group-hover:text-white"}`}>{faq.q}</span>
          <span className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full transition-all duration-500 ${isOpen ? "bg-fiper/20 border border-fiper/30 text-fiper" : "bg-white/5 border border-white/10 text-zinc-500 group-hover:border-white/20 group-hover:text-white"}`}>
            <motion.span animate={{ rotate: isOpen ? 135 : 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="block text-sm font-light leading-none">+</motion.span>
          </span>
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.3, delay: 0.1 } }} className="overflow-hidden">
              <div className="px-6 pb-5 pt-0">
                <div className="h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent mb-4" />
                <p className="text-sm leading-relaxed text-zinc-400">{faq.a}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CategorySection({ category }) {
  const [openIndex, setOpenIndex] = useState(-1);
  const Icon = category.icon;
  return (
    <section id={category.id} className="scroll-mt-32">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-fiper/10"><Icon size={20} className="text-fiper" /></div>
          <h2 className="text-2xl font-semibold text-white">{category.title}</h2>
        </div>
        <div className="space-y-2.5">
          {category.faqs.map((faq, i) => (
            <AccordionItem key={i} faq={faq} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default function HelpCenter() {
  const { t } = useTranslation();
  useDirection();
  const [rawQuery, setRawQuery] = useState("");
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      return stored ? JSON.parse(stored).slice(0, 5) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    document.title = t("helpCenter.heroTitle1") + " " + t("helpCenter.heroTitle2") + " | Wtraders Card";
    window.scrollTo(0, 0);
  }, [t]);

  // Debounce raw input → query (300 ms)
  useEffect(() => {
    const timer = setTimeout(() => setQuery(rawQuery), 300);
    return () => clearTimeout(timer);
  }, [rawQuery]);

  // "/" focuses search, Esc clears + blurs
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
        setRawQuery("");
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const categories = useMemo(() => getCategories(t), [t]);

  const fuse = useMemo(() => {
    const allFaqs = categories.flatMap((cat) =>
      cat.faqs.map((f) => ({ ...f, categoryId: cat.id, categoryTitle: cat.title, categoryIcon: cat.icon }))
    );
    return new Fuse(allFaqs, {
      keys: [
        { name: "q", weight: 0.7 },
        { name: "a", weight: 0.3 },
      ],
      threshold: 0.4,
      ignoreLocation: true,
      includeMatches: true,
      minMatchCharLength: 2,
    });
  }, [categories]);

  const filtered = useMemo(() => {
    if (!query.trim()) return categories;
    const results = fuse.search(query.trim());
    const grouped = {};
    results.forEach((r) => {
      const item = r.item;
      if (!grouped[item.categoryId]) {
        grouped[item.categoryId] = {
          id: item.categoryId,
          title: item.categoryTitle,
          icon: item.categoryIcon,
          faqs: [],
        };
      }
      grouped[item.categoryId].faqs.push({ q: item.q, a: item.a });
    });
    return Object.values(grouped);
  }, [query, fuse, categories]);

  const totalResults = filtered.reduce((n, c) => n + c.faqs.length, 0);

  // Persist successful searches to localStorage (top 5, unique, most-recent-first)
  useEffect(() => {
    const q = query.trim();
    if (!q || totalResults === 0) return;
    setRecentSearches((prev) => {
      const next = [q, ...prev.filter((s) => s !== q)].slice(0, 5);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        // ignore quota / privacy mode errors
      }
      return next;
    });
  }, [query, totalResults]);

  const clearSearch = () => {
    setRawQuery("");
    setQuery("");
  };

  return (
    <div className="noise-bg relative min-h-screen bg-black text-white">
      <a href="#help-main" className="skip-link">Skip to main content</a>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between py-5">
            <Link to="/" className="flex-shrink-0"><img src="/wtraders-logo.png" alt="Wtraders" className="h-20 md:h-24 w-auto object-contain" /></Link>
            <div className="flex items-center gap-3">
              <Link to="/" className="hidden sm:inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft size={14} className="rtl-flip" />
                {t("helpCenter.backToHome")}
              </Link>
              <LanguageSwitcher />
              <a href="https://crm.wtradersworld.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-fiper px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-fiper-dark">
                {t("nav.getYourCard")}
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main id="help-main" className="pt-36 pb-24">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-amber-600/8 blur-[120px]" /></div>
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl" style={{ letterSpacing: "-0.04em" }}>
                {t("helpCenter.heroTitle1")} <span className="text-gradient-red">{t("helpCenter.heroTitle2")}</span>
              </h1>
              <p className="mt-4 text-lg text-zinc-400">{t("helpCenter.heroSubtext")}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="mt-10">
              <div className="relative">
                <Search size={20} className="absolute start-5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={rawQuery}
                  onChange={(e) => setRawQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder={t("helpCenter.searchPlaceholder")}
                  aria-label={t("helpCenter.searchPlaceholder")}
                  className="w-full rounded-2xl bg-white/5 border border-white/10 ps-14 pe-16 py-4 text-base text-white placeholder-zinc-600 outline-none transition-all duration-300 focus:border-fiper/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-fiper/20"
                />
                {rawQuery ? (
                  <button
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="absolute end-5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white transition-colors"
                  >
                    {t("helpCenter.clear")}
                  </button>
                ) : (
                  !searchFocused && (
                    <kbd className="hidden md:inline-flex absolute end-5 top-1/2 -translate-y-1/2 items-center px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-xs text-zinc-400 pointer-events-none">/</kbd>
                  )
                )}
              </div>
              {query && <p className="mt-3 text-sm text-zinc-500">{totalResults} {totalResults === 1 ? "result" : "results"}</p>}
              {!rawQuery && recentSearches.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-xs text-zinc-500">Recent:</span>
                  {recentSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => setRawQuery(s)}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 mt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              const matchedCount = query ? (filtered.find((f) => f.id === cat.id)?.faqs.length ?? 0) : cat.faqs.length;
              const isMatched = !query || matchedCount > 0;
              return (
                <motion.a
                  key={cat.id}
                  href={`#${cat.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isMatched ? 1 : 0.3, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                  whileHover={isMatched ? { y: -4, transition: { duration: 0.25 } } : {}}
                  className={`glass card-shine rounded-2xl p-6 flex items-start gap-4 transition-all duration-300 group ${
                    isMatched ? "hover:bg-white/[0.04] hover:border-white/20" : "pointer-events-none"
                  }`}
                >
                  <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl transition-colors duration-300 ${
                    isMatched ? "bg-fiper/10 group-hover:bg-fiper/15" : "bg-white/5"
                  }`}>
                    <Icon size={20} className={isMatched ? "text-fiper" : "text-zinc-600"} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold ${isMatched ? "text-white" : "text-zinc-500"}`}>{cat.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      {matchedCount} {matchedCount === 1 ? "article" : "articles"}
                    </p>
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        </section>

        <div className="mx-auto max-w-3xl px-6 mt-20 space-y-16">
          {filtered.map((cat) => <CategorySection key={cat.id} category={cat} />)}
          {query && filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <p className="text-zinc-400 text-lg mb-3">{t("helpCenter.noResults", { query })}</p>
              <p className="text-zinc-500 text-sm mb-8">{t("helpCenter.noResultsHint")}</p>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
                <span className="text-xs text-zinc-500">Try:</span>
                {["activation", "Apple Pay", "ATM", "fees", "delivery"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setRawQuery(s)}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-fiper/10 border border-fiper/20 text-sm font-medium text-fiper hover:bg-fiper/20 transition-colors"
              >
                Contact Support
              </a>
            </motion.div>
          )}
        </div>

        <section className="mx-auto max-w-3xl px-6 mt-24">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-semibold sm:text-4xl" style={{ letterSpacing: "-0.03em" }}>
                {t("helpCenter.contactTitle1")} <span className="text-gradient-red">{t("helpCenter.contactTitle2")}</span>
              </h2>
              <p className="mt-3 text-zinc-400">{t("helpCenter.contactSubtext")}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <motion.a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" whileHover={{ y: -4, transition: { duration: 0.25 } }} className="glass card-shine rounded-2xl p-7 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/20 group block">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#25D366]/10 mb-5"><WhatsAppIcon className="w-6 h-6 text-[#25D366]" /></div>
                <h3 className="text-lg font-semibold text-white mb-2">{t("helpCenter.whatsappTitle")}</h3>
                <p className="text-sm text-zinc-400 mb-5">{t("helpCenter.whatsappDesc")}</p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-[#25D366] group-hover:gap-3 transition-all duration-300">
                  {t("helpCenter.whatsappCta")} <ArrowRight size={14} className="rtl-flip" />
                </span>
              </motion.a>
              <motion.a href="https://crm.wtradersworld.com" target="_blank" rel="noopener noreferrer" whileHover={{ y: -4, transition: { duration: 0.25 } }} className="glass card-shine rounded-2xl p-7 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/20 group block">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-fiper/10 mb-5"><LifeBuoy size={24} className="text-fiper" /></div>
                <h3 className="text-lg font-semibold text-white mb-2">{t("helpCenter.ticketTitle")}</h3>
                <p className="text-sm text-zinc-400 mb-5">{t("helpCenter.ticketDesc")}</p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-fiper group-hover:gap-3 transition-all duration-300">
                  {t("helpCenter.ticketCta")} <ArrowRight size={14} className="rtl-flip" />
                </span>
              </motion.a>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/"><img src="/wtraders-logo.png" alt="Wtraders" loading="lazy" decoding="async" className="h-14 w-auto object-contain" /></Link>
          <p className="text-xs text-zinc-600">{t("footer.copyright")}</p>
        </div>
      </footer>

      <WhatsAppButton />
      <StickyMobileCTA />
    </div>
  );
}
