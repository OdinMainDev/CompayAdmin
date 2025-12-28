// src/pages/landing/components/MobileMenu.tsx
import React, { useEffect } from "react";

type NavItem = { id: string; label: string };
const LANGS = ["en", "ru"] as const;

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

export function MobileMenu({
  open,
  nav,
  onClose,
  onNav,
  language,
  onChangeLanguage,
}: {
  open: boolean;
  nav: NavItem[];
  onClose: () => void;
  onNav: (id: string) => void;
  language: string;
  onChangeLanguage: (lng: string) => void;
}) {
  useLockBodyScroll(open);

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-visible", open);
    return () => document.body.classList.remove("mobile-menu-visible");
  }, [open]);

  return (
    <>
      <div className="tgmobile__menu" aria-hidden={!open}>
        <nav className="tgmobile__menu-box" aria-label="Mobile navigation">
          <button type="button" className="close-btn" aria-label="Close menu" onClick={onClose}>
            <i className="fas fa-times" aria-hidden="true" />
          </button>

          <div className="nav-logo">
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

          <div className="custom-mobile-nav">
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

          <div className="tgmobile__lang">
            <div className="lang-static">
              <div className="lang-label">{(language || "en").toUpperCase()}</div>
              <div className="lang-actions">
                {LANGS.map((lng) => (
                  <button
                    key={lng}
                    type="button"
                    className={cn("lang-option", language === lng && "active")}
                    onClick={() => onChangeLanguage(lng)}
                  >
                    {lng.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="social-links">
            <ul className="list-wrap">
              <li><a href="#!" aria-label="Facebook"><i className="fab fa-facebook-f" aria-hidden="true" /></a></li>
              <li><a href="#!" aria-label="Twitter"><i className="fab fa-twitter" aria-hidden="true" /></a></li>
              <li><a href="#!" aria-label="Instagram"><i className="fab fa-instagram" aria-hidden="true" /></a></li>
              <li><a href="#!" aria-label="LinkedIn"><i className="fab fa-linkedin-in" aria-hidden="true" /></a></li>
              <li><a href="#!" aria-label="YouTube"><i className="fab fa-youtube" aria-hidden="true" /></a></li>
            </ul>
          </div>
        </nav>
      </div>

      <div className={cn("tgmobile__menu-backdrop", open && "show")} onClick={onClose} aria-hidden={!open} />
    </>
  );
}
