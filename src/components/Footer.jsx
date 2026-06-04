import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const XIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>);
const IGIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>);
const LIIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>);
const YTIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>);

const socials = [
  { label: "X", icon: XIcon, href: "https://linktr.ee/wtraders" },
  { label: "Instagram", icon: IGIcon, href: "https://linktr.ee/wtraders" },
  { label: "LinkedIn", icon: LIIcon, href: "https://linktr.ee/wtraders" },
  { label: "YouTube", icon: YTIcon, href: "https://linktr.ee/wtraders" },
];

export default function Footer() {
  const { t } = useTranslation();
  const [emailValue, setEmailValue] = useState("");
  const [submitState, setSubmitState] = useState("idle"); // idle | submitting | success | error

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!emailValue || !/\S+@\S+\.\S+/.test(emailValue)) {
      setSubmitState("error");
      return;
    }
    setSubmitState("submitting");
    const message = encodeURIComponent(`Hi! Please add me to the Wtraders Card newsletter. Email: ${emailValue}`);
    window.open(`https://wa.me/971504868995?text=${message}`, "_blank", "noopener");
    setTimeout(() => {
      setSubmitState("success");
      setEmailValue("");
      setTimeout(() => setSubmitState("idle"), 4000);
    }, 600);
  };

  const productLinks = [
    { label: t("nav.features"), href: "#features" },
    { label: t("nav.cards"), href: "#cards" },
    { label: t("nav.faq"), href: "#faq" },
    { label: t("nav.helpCenter"), href: "/help-center", isRoute: true },
    { label: t("nav.getYourCard"), href: "#cards" },
  ];

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="mb-16 pb-16 border-b border-white/5">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-semibold text-white mb-3">{t("footer.newsletter")}</h3>
            <p className="text-sm text-zinc-500 mb-8">{t("footer.newsletterDesc")}</p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={emailValue}
                onChange={(e) => { setEmailValue(e.target.value); if (submitState === "error") setSubmitState("idle"); }}
                placeholder={t("footer.emailPlaceholder")}
                aria-label={t("footer.emailPlaceholder")}
                className={`flex-1 rounded-full bg-white/5 border ps-5 pe-5 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-300 focus:bg-white/[0.07] focus:ring-1 ${
                  submitState === "error" ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-white/10 focus:border-fiper/50 focus:ring-fiper/20"
                }`}
              />
              <button
                type="submit"
                disabled={submitState === "submitting"}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-fiper px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-fiper-dark hover:shadow-lg hover:shadow-amber-500/20 disabled:opacity-60"
              >
                {submitState === "submitting" ? "..." : t("footer.subscribe")}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5 rtl-flip" />
              </button>
            </form>
            {submitState === "success" && (
              <p className="mt-3 text-xs text-emerald-400" role="status" aria-live="polite">✓ Opening WhatsApp — please send the prefilled message.</p>
            )}
            {submitState === "error" && (
              <p className="mt-3 text-xs text-red-400" role="alert">Please enter a valid email address.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <a href="#home"><img src="/wtraders-logo.png" alt="Wtraders" loading="lazy" decoding="async" className="h-20 w-auto object-contain" /></a>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">{t("footer.tagline")}</p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-500 transition-all duration-200 hover:text-white hover:border-white/25 hover:bg-white/5">
                  <s.icon />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">{t("footer.product")}</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link to={link.href} className="text-sm text-zinc-500 transition-colors duration-200 hover:text-white">{link.label}</Link>
                  ) : (
                    <a href={link.href} className="text-sm text-zinc-500 transition-colors duration-200 hover:text-white">{link.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-3">
              {[t("footer.terms"), t("footer.privacy"), t("footer.cookie"), t("footer.refund")].map((label) => (
                <li key={label}><a href="https://wtradersworld.com/legal-documentation" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 transition-colors duration-200 hover:text-white">{label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-zinc-600">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
