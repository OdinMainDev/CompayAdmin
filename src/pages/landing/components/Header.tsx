// src/pages/landing/components/Header.tsx
import React, { useEffect, useMemo, useState } from "react";

type NavItem = { id: string; label: string };

const LANGS = ["en", "ru"] as const;

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function useSticky(threshold = 245) {
  const [sticky, setSticky] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setSticky(y >= threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return sticky;
}

export function Header({
  nav,
  onNav,
  onOpenMobile,
  language,
  onChangeLanguage,
}: {
  nav: NavItem[];
  onNav: (id: string) => void;
  onOpenMobile: () => void;
  language: string;
  onChangeLanguage: (lng: string) => void;
}) {
  const isSticky = useSticky(245);
  const [langOpen, setLangOpen] = useState(false);

  const langLabel = useMemo(() => (language || "en").toUpperCase(), [language]);

  useEffect(() => {
    if (!langOpen) return;
    const onDoc = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(".lang-dropdown")) return;
      setLangOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [langOpen]);

  return (
    <header id="home">
      <div
        id="sticky-header"
        className={cn("tg-header__area transparent-header", isSticky && "sticky-menu")}
      >
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="tgmenu__wrap">
                <nav className="tgmenu__nav" aria-label="Main navigation">
                  <div className="logo">
                    <a
                      href="#home"
                      onClick={(e) => {
                        e.preventDefault();
                        onNav("home");
                      }}
                    >
                      <img src="/landing/img/logo/logo.svg" alt="Logo" />
                    </a>
                  </div>

                  <div className="tgmenu__navbar-wrap tgmenu__main-menu d-none d-lg-flex">
                    <ul className="navigation">
                      {nav.map((item) => (
                        <li key={item.id}>
                          <a
                            className="section-link"
                            href={`#${item.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              onNav(item.id);
                            }}
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="tgmenu__action">
                    <ul className="list-wrap align-items-center">
                      <li>
                        <div className="lang-dropdown">
                          <button
                            type="button"
                            className={cn("lang-toggle", langOpen && "open")}
                            onClick={() => setLangOpen((p) => !p)}
                            aria-haspopup="listbox"
                            aria-expanded={langOpen}
                          >
                            <span className="lang-label">{langLabel}</span>
                            <span className="caret" aria-hidden="true" />
                          </button>

                          {langOpen && (
                            <ul className="lang-menu" role="listbox">
                              {LANGS.map((lng) => (
                                <li key={lng}>
                                  <button
                                    type="button"
                                    className={cn("lang-option", language === lng && "active")}
                                    role="option"
                                    aria-selected={language === lng}
                                    onClick={() => {
                                      onChangeLanguage(lng);
                                      setLangOpen(false);
                                    }}
                                  >
                                    {lng.toUpperCase()}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    className="mobile-nav-toggler"
                    aria-label="Open menu"
                    onClick={onOpenMobile}
                  >
                    <i className="fas fa-bars" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="header-fixed-height" className={cn(isSticky && "active-height")} />
    </header>
  );
}
