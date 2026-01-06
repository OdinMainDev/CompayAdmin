// src/pages/landing/LandingPage.tsx
import '../../styles/landing/custom.scss';
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollTopButton } from "./components/ScrollTopButton";
import { ActiveMenuOnScroll } from "./components/ActiveMenuOnScroll";
import { ContactModal } from "./components/ContactModal";
import { RevealOnScroll } from "./components/RevealOnScroll";


type NavItem = { id: string; label: string };
type RoadmapItem = { year: string; desc: string };

const LANGS = ["en", "ru"] as const;

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function asset(path: string): string {
  const clean = path.startsWith("/") ? path.slice(1) : path;

  const viteBase = (globalThis as any)?.import?.meta?.env?.BASE_URL as string | undefined;
  if (viteBase) return `${viteBase}${clean}`.replace(/\/{2,}/g, "/");

  const publicUrl = (globalThis as any)?.process?.env?.PUBLIC_URL as string | undefined;
  if (publicUrl) return `${publicUrl.replace(/\/$/, "")}/${clean}`.replace(/\/{2,}/g, "/");
  return `/${clean}`;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
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

function useScrollTopVisible(threshold = 245) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setVisible(y >= threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return visible;
}

function useOutsideClick<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node | null;
      const node = ref.current;
      if (!t || !node) return;
      if (!node.contains(t)) onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside]);
  return ref;
}

function Countdown({ target }: { target: string }) {
  const targetMs = useMemo(() => new Date(target).getTime(), [target]);
  const [left, setLeft] = useState(() => Math.max(0, targetMs - Date.now()));

  useEffect(() => {
    const id = window.setInterval(() => setLeft(Math.max(0, targetMs - Date.now())), 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  const total = Math.floor(left / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  return (
    <div className="flex flex-wrap gap-[20px]">
      <div className="time-count day">
        <span>{String(days).padStart(2, "0")}</span>days
      </div>
      <div className="time-count hour">
        <span>{String(hours).padStart(2, "0")}</span>hours
      </div>
      <div className="time-count min">
        <span>{String(minutes).padStart(2, "0")}</span>min
      </div>
      <div className="time-count sec">
        <span>{String(seconds).padStart(2, "0")}</span>sec
      </div>
    </div>
  );
}


function Header({
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

  const [activeId, setActiveId] = useState<string>("features");
  useEffect(() => {
    const ids = ["home", ...nav.map((n) => n.id)];
    const headerOffset = 110;

    let raf = 0;

    const computeActive = () => {
      const y = (window.scrollY || 0) + headerOffset + 1;

      let current = ids[0];

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;

        const top = el.offsetTop;
        if (top <= y) current = id;
        else break;
      }

      setActiveId((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        computeActive();
      });
    };

    computeActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [nav]);

  useEffect(() => {
  const headerOffset = 120;
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("a.section-link"));

  if (!links.length) return;

  let raf = 0;

  const setActiveByScroll = () => {
    const scrollbarLocation = window.scrollY || 0;

    let activeLi: HTMLElement | null = null;

    for (const a of links) {
      const hash = a.hash;
      if (!hash) continue;

      const section = document.querySelector<HTMLElement>(hash);
      if (!section) continue;

      const sectionOffset = section.offsetTop - headerOffset;

      if (sectionOffset <= scrollbarLocation) {
        activeLi = a.parentElement as HTMLElement | null;
      }
    }

    for (const a of links) {
      const li = a.parentElement as HTMLElement | null;
      if (!li) continue;
      li.classList.toggle("active", li === activeLi);
    }
  };

  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      setActiveByScroll();
    });
  };

  setActiveByScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    if (raf) cancelAnimationFrame(raf);
  };
}, []);


  const [langOpen, setLangOpen] = useState(false);
  const ddRef = useOutsideClick<HTMLDivElement>(() => setLangOpen(false));
  const langLabel = (language || "en").toUpperCase();
  

  return (
    <header id="home">
      <div id="sticky-header" className={cn("tg-header__area transparent-header", isSticky && "sticky-menu")}>
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="131" height="40" viewBox="0 0 131 40" fill="none">
                        <path d="M120.623 23.5572L114.836 6H118.003L122.266 19.4514L126.567 6H129.46L123.634 23.5572V33.3721H120.623V23.5572Z" fill="#F8BD7A"/>
                        <path d="M103.931 27.8586L102.875 33.3721H100.06L105.3 6H109.718L114.958 33.3721H111.908L110.852 27.8586H103.931ZM104.322 25.2387H110.422L107.333 9.44106L104.322 25.2387Z" fill="#F8BD7A"/>
                        <path d="M94.2601 6C96.4238 6 97.9879 6.59958 98.9525 7.79874C99.917 8.97183 100.399 10.6011 100.399 12.6866V15.9713C100.399 18.161 99.8779 19.8164 98.8352 20.9373C97.8185 22.0322 96.2153 22.5797 94.0255 22.5797H91.3274V33.3721H88.2773V6H94.2601ZM94.0255 19.8425C95.1725 19.8425 96.0197 19.5687 96.5672 19.0213C97.1146 18.4478 97.3883 17.4963 97.3883 16.1668V12.5302C97.3883 11.2789 97.1407 10.3404 96.6454 9.71479C96.1761 9.08914 95.3811 8.77631 94.2601 8.77631H91.3274V19.8425H94.0255Z" fill="#F8BD7A"/>
                        <path d="M63.996 0H67.6614V9.12094C62.5562 10.0329 58.7271 14.4666 58.7271 19.7343C58.7271 25.0021 62.5562 29.4358 67.6614 30.3477V39.4686H63.996V35.2889C57.5852 32.9995 53 26.8996 53 19.7343C53 12.569 57.5852 6.46914 63.996 4.17974V0Z" fill="#F8BD7A"/>
                        <path d="M71.7849 39.4686H75.4503V35.2052C78.4539 34.0823 81.0439 32.1187 82.9304 29.6026L78.3579 26.1464C76.7912 28.2448 74.4731 29.7646 71.7849 30.3043V39.4686Z" fill="#F8BD7A"/>
                        <path d="M71.7849 0H75.4503V4.26346C78.3956 5.36451 80.9432 7.27401 82.8198 9.72017L78.2472 13.1765C76.683 11.1535 74.4105 9.69149 71.7849 9.16443V0Z" fill="#F8BD7A"/>
                        <path d="M68.7083 21.997H67.149C65.546 21.997 64.7445 21.997 64.4088 21.485C64.0731 20.9729 64.4099 20.2639 65.0833 18.8458L68.1919 12.3006C68.6178 11.4039 68.8306 10.9555 69.0541 11.0035C69.2774 11.0514 69.2774 11.5455 69.2774 12.5336V17.4483C69.2774 17.7098 69.2774 17.8406 69.3607 17.9218C69.444 18.003 69.5782 18.003 69.8464 18.003H71.4058C73.0088 18.003 73.8103 18.003 74.1459 18.515C74.4815 19.0271 74.1449 19.7361 73.4714 21.154L70.3628 27.6994C69.9369 28.5961 69.7241 29.0444 69.5007 28.9965C69.2774 28.9486 69.2774 28.4545 69.2774 27.4664V22.5517C69.2774 22.2902 69.2774 22.1594 69.194 22.0782C69.1107 21.997 68.9766 21.997 68.7083 21.997Z" fill="#F8BD7A"/>
                        <path d="M40.5812 32.9443H37.7062L33.2595 11.5927V32.9827H30.6528V6.14932H34.8312L39.2395 27.5777L43.4945 6.14932H47.6728V32.9827H44.8362V11.401L40.5812 32.9443Z" fill="white"/>
                        <path d="M15.562 12.6277C15.562 10.5577 16.0603 8.92211 17.057 7.721C18.0792 6.49433 19.6253 5.881 21.6953 5.881C23.7653 5.881 25.3115 6.49433 26.3337 7.721C27.3559 8.92211 27.867 10.5577 27.867 12.6277V26.5043C27.867 28.5488 27.3559 30.1843 26.3337 31.411C25.3115 32.6377 23.7653 33.251 21.6953 33.251C19.6253 33.251 18.0792 32.6377 17.057 31.411C16.0603 30.1843 15.562 28.5488 15.562 26.5043V12.6277ZM18.5137 26.6577C18.5137 27.8843 18.7692 28.8427 19.2803 29.5327C19.817 30.1971 20.622 30.5293 21.6953 30.5293C22.7942 30.5293 23.5992 30.1971 24.1103 29.5327C24.6215 28.8427 24.877 27.8843 24.877 26.6577V12.4743C24.877 11.2477 24.6215 10.3021 24.1103 9.63766C23.5992 8.94766 22.7942 8.60266 21.6953 8.60266C20.622 8.60266 19.817 8.94766 19.2803 9.63766C18.7692 10.3021 18.5137 11.2477 18.5137 12.4743V26.6577Z" fill="white"/>
                        <path d="M7.01833 5.88101C9.08833 5.88101 10.6089 6.49434 11.58 7.72101C12.5767 8.94768 13.075 10.5832 13.075 12.6277V15.0427H10.2383V12.4743C10.2383 11.2477 9.98278 10.3021 9.47167 9.63768C8.98611 8.94768 8.19389 8.60268 7.095 8.60268C6.02167 8.60268 5.22944 8.94768 4.71833 9.63768C4.20722 10.3021 3.95167 11.2477 3.95167 12.4743V26.6577C3.95167 27.8843 4.20722 28.8427 4.71833 29.5327C5.22944 30.1971 6.02167 30.5293 7.095 30.5293C8.19389 30.5293 8.98611 30.1971 9.47167 29.5327C9.98278 28.8427 10.2383 27.8843 10.2383 26.6577V23.1693H13.075V26.5043C13.075 28.5488 12.5767 30.1843 11.58 31.411C10.6089 32.6377 9.08833 33.251 7.01833 33.251C4.97389 33.251 3.45333 32.6377 2.45667 31.411C1.48556 30.1843 1 28.5488 1 26.5043V12.6277C1 11.6055 1.115 10.6855 1.345 9.86768C1.60056 9.02434 1.97111 8.30879 2.45667 7.72101C2.96778 7.13323 3.59389 6.68601 4.335 6.37935C5.10167 6.04712 5.99611 5.88101 7.01833 5.88101Z" fill="white"/>
                      </svg>
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
                        <div className="lang-dropdown" ref={ddRef}>
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

                  <button type="button" className="mobile-nav-toggler" aria-label="Open menu" onClick={onOpenMobile}>
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

function MobileMenu({
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

  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="tgmobile__menu" aria-hidden={!open}>
        <nav className="tgmobile__menu-box" aria-label="Mobile navigation">
          <button type="button" className="close-btn my-[5px]" aria-label="Close menu" onClick={onClose}>
            <i className="fas fa-times" aria-hidden="true" />
          </button>

          <div className="nav-logo">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                onNav("home");
                onClose();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="131" height="40" viewBox="0 0 131 40" fill="none">
                <path d="M120.623 23.5572L114.836 6H118.003L122.266 19.4514L126.567 6H129.46L123.634 23.5572V33.3721H120.623V23.5572Z" fill="#F8BD7A"/>
                <path d="M103.931 27.8586L102.875 33.3721H100.06L105.3 6H109.718L114.958 33.3721H111.908L110.852 27.8586H103.931ZM104.322 25.2387H110.422L107.333 9.44106L104.322 25.2387Z" fill="#F8BD7A"/>
                <path d="M94.2601 6C96.4238 6 97.9879 6.59958 98.9525 7.79874C99.917 8.97183 100.399 10.6011 100.399 12.6866V15.9713C100.399 18.161 99.8779 19.8164 98.8352 20.9373C97.8185 22.0322 96.2153 22.5797 94.0255 22.5797H91.3274V33.3721H88.2773V6H94.2601ZM94.0255 19.8425C95.1725 19.8425 96.0197 19.5687 96.5672 19.0213C97.1146 18.4478 97.3883 17.4963 97.3883 16.1668V12.5302C97.3883 11.2789 97.1407 10.3404 96.6454 9.71479C96.1761 9.08914 95.3811 8.77631 94.2601 8.77631H91.3274V19.8425H94.0255Z" fill="#F8BD7A"/>
                <path d="M63.996 0H67.6614V9.12094C62.5562 10.0329 58.7271 14.4666 58.7271 19.7343C58.7271 25.0021 62.5562 29.4358 67.6614 30.3477V39.4686H63.996V35.2889C57.5852 32.9995 53 26.8996 53 19.7343C53 12.569 57.5852 6.46914 63.996 4.17974V0Z" fill="#F8BD7A"/>
                <path d="M71.7849 39.4686H75.4503V35.2052C78.4539 34.0823 81.0439 32.1187 82.9304 29.6026L78.3579 26.1464C76.7912 28.2448 74.4731 29.7646 71.7849 30.3043V39.4686Z" fill="#F8BD7A"/>
                <path d="M71.7849 0H75.4503V4.26346C78.3956 5.36451 80.9432 7.27401 82.8198 9.72017L78.2472 13.1765C76.683 11.1535 74.4105 9.69149 71.7849 9.16443V0Z" fill="#F8BD7A"/>
                <path d="M68.7083 21.997H67.149C65.546 21.997 64.7445 21.997 64.4088 21.485C64.0731 20.9729 64.4099 20.2639 65.0833 18.8458L68.1919 12.3006C68.6178 11.4039 68.8306 10.9555 69.0541 11.0035C69.2774 11.0514 69.2774 11.5455 69.2774 12.5336V17.4483C69.2774 17.7098 69.2774 17.8406 69.3607 17.9218C69.444 18.003 69.5782 18.003 69.8464 18.003H71.4058C73.0088 18.003 73.8103 18.003 74.1459 18.515C74.4815 19.0271 74.1449 19.7361 73.4714 21.154L70.3628 27.6994C69.9369 28.5961 69.7241 29.0444 69.5007 28.9965C69.2774 28.9486 69.2774 28.4545 69.2774 27.4664V22.5517C69.2774 22.2902 69.2774 22.1594 69.194 22.0782C69.1107 21.997 68.9766 21.997 68.7083 21.997Z" fill="#F8BD7A"/>
                <path d="M40.5812 32.9443H37.7062L33.2595 11.5927V32.9827H30.6528V6.14932H34.8312L39.2395 27.5777L43.4945 6.14932H47.6728V32.9827H44.8362V11.401L40.5812 32.9443Z" fill="white"/>
                <path d="M15.562 12.6277C15.562 10.5577 16.0603 8.92211 17.057 7.721C18.0792 6.49433 19.6253 5.881 21.6953 5.881C23.7653 5.881 25.3115 6.49433 26.3337 7.721C27.3559 8.92211 27.867 10.5577 27.867 12.6277V26.5043C27.867 28.5488 27.3559 30.1843 26.3337 31.411C25.3115 32.6377 23.7653 33.251 21.6953 33.251C19.6253 33.251 18.0792 32.6377 17.057 31.411C16.0603 30.1843 15.562 28.5488 15.562 26.5043V12.6277ZM18.5137 26.6577C18.5137 27.8843 18.7692 28.8427 19.2803 29.5327C19.817 30.1971 20.622 30.5293 21.6953 30.5293C22.7942 30.5293 23.5992 30.1971 24.1103 29.5327C24.6215 28.8427 24.877 27.8843 24.877 26.6577V12.4743C24.877 11.2477 24.6215 10.3021 24.1103 9.63766C23.5992 8.94766 22.7942 8.60266 21.6953 8.60266C20.622 8.60266 19.817 8.94766 19.2803 9.63766C18.7692 10.3021 18.5137 11.2477 18.5137 12.4743V26.6577Z" fill="white"/>
                <path d="M7.01833 5.88101C9.08833 5.88101 10.6089 6.49434 11.58 7.72101C12.5767 8.94768 13.075 10.5832 13.075 12.6277V15.0427H10.2383V12.4743C10.2383 11.2477 9.98278 10.3021 9.47167 9.63768C8.98611 8.94768 8.19389 8.60268 7.095 8.60268C6.02167 8.60268 5.22944 8.94768 4.71833 9.63768C4.20722 10.3021 3.95167 11.2477 3.95167 12.4743V26.6577C3.95167 27.8843 4.20722 28.8427 4.71833 29.5327C5.22944 30.1971 6.02167 30.5293 7.095 30.5293C8.19389 30.5293 8.98611 30.1971 9.47167 29.5327C9.98278 28.8427 10.2383 27.8843 10.2383 26.6577V23.1693H13.075V26.5043C13.075 28.5488 12.5767 30.1843 11.58 31.411C10.6089 32.6377 9.08833 33.251 7.01833 33.251C4.97389 33.251 3.45333 32.6377 2.45667 31.411C1.48556 30.1843 1 28.5488 1 26.5043V12.6277C1 11.6055 1.115 10.6855 1.345 9.86768C1.60056 9.02434 1.97111 8.30879 2.45667 7.72101C2.96778 7.13323 3.59389 6.68601 4.335 6.37935C5.10167 6.04712 5.99611 5.88101 7.01833 5.88101Z" fill="white"/>
              </svg>
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
                      onClose();
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="tgmobile__lang" onClick={(e) => e.stopPropagation()}>
              <ul className="list-wrap align-items-center">
                <li className="flex justify-center">
                  <div className="lang-dropdown relative">
                    <button
                      type="button"
                      className="lang-toggle flex items-center gap-2"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <span className="lang-label">{language.toUpperCase()}</span>
                      <span className={`caret ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <ul
                      className={cn(
                        "lang-menu absolute left-0 mt-2 w-full transition-all duration-200 ease-out",
                        isOpen 
                          ? "opacity-100 visible translate-y-0 pointer-events-auto" 
                          : "opacity-0 invisible -translate-y-2 pointer-events-none"
                      )}
                      role="listbox"
                    >
                      {LANGS.map((lng) => (
                        <li key={lng}>
                          <button
                            type="button"
                            className={cn("lang-option block w-full text-left", language === lng && "active")}
                            onClick={() => {
                              onChangeLanguage(lng);
                              setIsOpen(false); 
                            }}
                          >
                            {lng.toUpperCase()}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>
            </div>

          <div className="social-links">
            <ul className="list-wrap">
              <li>
                <a href="#!" aria-label="Facebook">
                  <i className="fab fa-facebook-f" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href="#!" aria-label="Twitter">
                  <i className="fab fa-twitter" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href="#!" aria-label="Instagram">
                  <i className="fab fa-instagram" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href="#!" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href="#!" aria-label="YouTube">
                  <i className="fab fa-youtube" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className={cn("tgmobile__menu-backdrop", open && "show")} onClick={onClose} aria-hidden={!open} />
    </>
  );
}

export async function submitContact(endpoint: string, payload: { username: string }) {
  try {
    const body = new URLSearchParams();
    body.set("username", payload.username);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Accept": "text/plain,application/json,*/*",
      },
      body: body.toString(),
      credentials: "same-origin",
    });

    const text = await res.text();

    if (!res.ok) return { ok: false as const, message: text || `HTTP ${res.status}` };

    const normalized = (text || "").trim().toLowerCase();
    const okByBody =
      !normalized ||
      normalized === "ok" ||
      normalized === "success" ||
      normalized === "1" ||
      normalized === "true";

    return { ok: okByBody as true, message: text || "OK" };
  } catch {
    return { ok: false as const, message: "Network error" };
  }
}
const submitContactHandler = async (username: string) => {
  const { ok } = await submitContact("/contact", { username });
  return ok;
};


export default function LandingPage() {
  const { t, i18n } = useTranslation("landing");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  type FaqKey = "q1" | "q2" | "q3";

  const [open, setOpen] = useState<Record<FaqKey, boolean>>({
    q1: true,
    q2: false,
    q3: false,
  });

  const toggleFaq = (key: FaqKey) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };


  const nav: NavItem[] = useMemo(
    () => [
      { id: "features", label: t("nav.features", "Features") },
      { id: "token", label: t("nav.integration", "Integration") },
      { id: "work", label: t("nav.work", "Work") },
      { id: "roadmap", label: t("nav.roadmap", "Roadmap") },
    ],
    [t]
  );

  const roadmap: RoadmapItem[] = [
    t('roadmap.items.y2023', { returnObjects: true }) as RoadmapItem,
    t('roadmap.items.y2024', { returnObjects: true }) as RoadmapItem,
    t('roadmap.items.y2025', { returnObjects: true }) as RoadmapItem,
    t('roadmap.items.y2026', { returnObjects: true }) as RoadmapItem,
  ];


const onNav = useCallback((id: string) => {
  scrollToId(id);
}, []);

  const onChangeLanguage = useCallback(
    async (lng: string) => {
      if (i18n.language === lng) return;
      await i18n.changeLanguage(lng);
    },
    [i18n]
  );

  const PlusMinusIcon = ({ open }: { open: boolean }) => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="transition-transform duration-300"
    >
      <rect
        x="0"
        y="8"
        width="18"
        height="2"
        fill="currentColor"
        rx="1"
      />
      <rect
        x="8"
        y="0"
        width="2"
        height="18"
        fill="currentColor"
        rx="1"
        className={`transition-all duration-300 ${open ? "scale-y-0 opacity-0" : "scale-y-100 opacity-100"}`}
      />
    </svg>
  );

  return (
    <div className="landing-wrapper tg-home-one text-white" style={{ backgroundColor: "var(--tg-color-dark)" }}>

      <Header
        nav={nav}
        onNav={onNav}
        onOpenMobile={() => setMobileOpen(true)}
        language={i18n.language}
        onChangeLanguage={onChangeLanguage}
      />

      <MobileMenu
        open={mobileOpen}
        nav={nav}
        onClose={() => setMobileOpen(false)}
        onNav={onNav}
        language={i18n.language}
        onChangeLanguage={onChangeLanguage}
      />

      <ScrollTopButton threshold={245} />
      <ActiveMenuOnScroll menuSelector=".tgmenu__navbar-wrap" headerOffset={120} />

      <main className="main-area fix">
      <RevealOnScroll>
        <section className="banner__area" id="home">
          <div className="relative w-full max-w-full mx-auto">
            <img
              src="/landing/img/decor/fx_bg.svg"
              alt=""
              aria-hidden="true"
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[120vw] max-w-none z-[1] pointer-events-none select-none"
            />
          </div>


          <div className="fx-bg" />
          <div className="container mb-[200px]">
            <div className="row justify-content-center">
              <div className="col-xl-7 col-lg-8 col-md-10">
                <div className="banner__content">
                  <span className="sub-title">{t("hero.badge", "Next-gen platform")}</span>
                  <h1 className="title">{t("hero.title", "COMPAY")}</h1>
                  <p className="desc">{t("hero.subtitle", "Replace with your real content.")}</p>

                  <div className="banner__btn-wrap">
                    <button type="button" className="tg-btn tg-btn-two" onClick={() => setContactOpen(true)}>
                      {t("hero.cta", "Contact")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="banner__shape pt-2">
            <img src="/landing/img/decor/hero_img01.png" alt="shape" className="alltuchtopdown" />
            <img src="/landing/img/decor/hero_img02.png" alt="shape" className="rotateme" />
            <img src="/landing/img/decor/hero_img03.png" alt="shape" className="alltuchtopdown" />
            <img src="/landing/img/decor/hero_bg_shape.svg" alt="shape" className="banner__bg" />
          </div> */}
          <div className="fx-decor pt-2">
            <img src="/landing/img/decor/fx_01.png" alt="" className="alltuchtopdown !z-[1]" />
            <img src="/landing/img/decor/fx_02.png" alt="" className="rotateme !z-[1]" />
            <img src="/landing/img/decor/fx_03.png" alt="" className="alltuchtopdown !z-[1]" />
            <img src="/landing/img/decor/hero_bg.svg" alt="" className="fx-decor" />
          </div>

        </section>

        <section id="features" className="features__area pt-[120px]">
          <div className="container mb-7">
            <div className="row justify-content-center pb-6">
              <div className="col-lg-6">
                <div className="section__title text-center">
                  <span className="sub-title">{t("features.badge", "Features")}</span>
                  <h2 className="title">{t("features.title", "Everything you need")}</h2>
                </div>
              </div>
            </div>

            <div className="row gutter-y-40 max-[540px]:space-y-[20px]">
          <div className="grid grid-cols-2 gap-[20px] max-[540px]:grid-cols-1">

              <div className="w-full">
                <div className="features__item">
                  <div className="features__icon">
                    <img src={asset("landing/img/icon/features_icon01.png")} alt="Feature 1" />
                  </div>
                  <div>
                    <h3 className="title">{t("features.items.accept.title", "Enterprise-grade")}</h3>
                    <p className="desc">{t("features.items.accept.desc", "Replace this with your original content.")}</p>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <div className="features__item">
                  <div className="features__icon">
                    <img src={asset("landing/img/icon/features_icon02.png")} alt="Feature 2" />
                  </div>
                  <div>
                    <h3 className="title">{t("features.items.accept.title", "Secure by design")}</h3>
                    <p className="desc">{t("features.items.accept.desc", "Replace this with your original content.")}</p>
                  </div>
                </div>
              </div>
            </div>

              <div className="grid grid-cols-3 gap-[20px] max-[540px]:grid-cols-1">
                <div className="w-full">
                <div className="features__item">
                  <div className="flex flex-col items-center text-center gap-[10px]">
                    <div className="features__icon pb-[20px]">
                      <img src={asset("landing/img/icon/features_icon03.png")} alt="Feature 2" />
                    </div>
                    <div>
                      <h3 className="title">{t("features.items.realtime.title", "Secure by design")}</h3>
                      <p className="desc">{t("features.items.realtime.desc", "Replace this with your original content.")}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="features__item">
                  <div className="flex flex-col items-center text-center gap-[10px]">
                  <div className="features__icon pb-[20px]">
                    <img src={asset("landing/img/icon/features_icon04.png")} alt="Feature 2" />
                  </div>
                    <h3 className="title">{t("features.items.risk.title", "Secure by design")}</h3>
                    <p className="desc">{t("features.items.risk.desc", "Replace this with your original content.")}</p>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="features__item">
                  <div className="flex flex-col items-center text-center gap-[10px]">
                    <div className="features__icon pb-[20px]">
                      <img src={asset("landing/img/icon/features_icon05.png")} alt="Feature 2" />
                    </div>
                    <div>
                      <h3 className="title">{t("features.items.aml.title", "Secure by design")}</h3>
                      <p className="desc">{t("features.items.aml.desc", "Replace this with your original content.")}</p>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>

            <div className="features__shape">
              <img src={asset("landing/img/images/features_shape.png")} alt="Features shape" />
            </div>
          </div>
        </section>

        <section className="marquee__area">
          <div className="slider__marquee clearfix marquee-wrap overflow-hidden">
            <div
              className="flex w-max whitespace-nowrap"
              style={{
                animation: "marqueeMove 18s linear infinite",
                willChange: "transform",
              }}
            >
              <div className="marquee_mode marquee__group flex items-center">
                <h6 className="marquee__item max-[720px]:!text-[70px] !text-white">{t("marquee.text")}</h6>
              </div>
              <div className="marquee_mode marquee__group flex items-center">
                <h6 className="marquee__item max-[720px]:!text-[70px] !text-white">{t("marquee.text")}</h6>
              </div>
              <div className="marquee_mode marquee__group flex items-center">
                <h6 className="marquee__item max-[720px]:!text-[70px] !text-white">{t("marquee.text")}</h6>
              </div>
              <div className="marquee_mode marquee__group flex items-center">
                <h6 className="marquee__item max-[720px]:!text-[70px] !text-white">{t("marquee.text")}</h6>
              </div>
              <div className="marquee_mode marquee__group flex items-center">
                <h6 className="marquee__item max-[720px]:!text-[70px] !text-white">{t("marquee.text")}</h6>
              </div>
              <div className="marquee_mode marquee__group flex items-center">
                <h6 className="marquee__item max-[720px]:!text-[70px] !text-white">{t("marquee.text")}</h6>
              </div>
              <div className="marquee_mode marquee__group flex items-center">
                <h6 className="marquee__item max-[720px]:!text-[70px] !text-white">{t("marquee.text")}</h6>
              </div>
              <div className="marquee_mode marquee__group flex items-center">
                <h6 className="marquee__item max-[720px]:!text-[70px] !text-white">{t("marquee.text")}</h6>
              </div>
              <div className="marquee_mode marquee__group flex items-center">
                <h6 className="marquee__item max-[720px]:!text-[70px] !text-white">{t("marquee.text")}</h6>
              </div>
              <div className="marquee_mode marquee__group flex items-center">
                <h6 className="marquee__item max-[720px]:!text-[70px] !text-white">{t("marquee.text")}</h6>
              </div>
              <div className="marquee_mode marquee__group flex items-center">
                <h6 className="marquee__item max-[720px]:!text-[70px] !text-white">{t("marquee.text")}</h6>
              </div>
            </div>

            <style>{`
              @keyframes marqueeMove {
                0% { transform: translate3d(0,0,0); }
                100% { transform: translate3d(-7%,0,0); }
              }
            `}</style>
          </div>
        </section>


        <section id="token" className="token__area pt-[120px]">
          <div className="container border-b border-white/10">
            <div className="row align-items-center g-4 mb-7">
              <div className="col-lg-6">
                <div className="token__content">
                  <div className="section__title mb-5">
                    <span className="sub-title">{t("token.badge", "Integration")}</span>
                    <h2 className="title">{t("token.title", "Token / Integration")}</h2>
                  </div>

                  <p className="desc">{t("token.subtitle", "Replace with your original content.")}</p>

                  <div className="token__btn-wrap">
                    <button type="button" className="tg-btn tg-btn-two" onClick={() => setContactOpen(true)}>
                      {t("token.cta", "Contact")}
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="token__wrap">
                  <div className="token__wrap-inner">
                    <h4 className="title">{t('token.counterTitle')}</h4>

                    <div className="countdown__wrap">
                      <div className="coming-time">
                        <Countdown target={t("token.targetDate", "2026-12-30T00:00:00Z")} />
                      </div>
                    </div>

                    <h3 className="token__received">
                      {t("token.receivedPercent", "100%")} <span>{t("token.receivedLabel", "Received")}</span>
                    </h3>

                    <div className="token__progress-wrap">
                      <div className="token__progress-meta flex justify-between">
                        <span>{t("token.rangeStart", "Softcap")}</span>
                        <span>{t("token.rangeEnd", "Hardcap")}</span>
                      </div>

                      <div className="progress" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}>
                        <div className="progress-bar" style={{ width: "50%" }} />
                      </div>
                    </div>
                  </div>

                  <div className="copy-text">
                    <mark>{t('token.copy')}</mark>
                    <button className="copy-btn" onClick={() => navigator.clipboard.writeText(t('token.copy'))}>
                      <img src="/landing/img/icon/copy.svg" alt="copy" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="work__area pt-[120px]">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="section__title text-center mb-4">
                  <span className="sub-title">{t('work.badge')}</span>
                  <h2 className="title">{t('work.title')}</h2>
                </div>
              </div>
            </div>
            <div className="work__item-wrap">
              <div className="work__img">
                <img src="/landing/img/images/work_img.png" alt="img" className="alltuchtopdown" />
              </div>
              <div className="row">
                <div className="col-lg-6" data-aos-delay="0">
                  <div className="work__item">
                    <h1 className="number">01</h1>
                    <h4 className="title">{t('work.steps.one.title')}</h4>
                    <p>{t('work.steps.one.desc')}</p>
                  </div>
                  <div className="work__item mb-0">
                    <h1 className="number">02</h1>
                    <h4 className="title">{t('work.steps.two.title')}</h4>
                    <p>{t('work.steps.two.desc')}</p>
                  </div>
                </div>
                <div className="col-lg-6" data-aos-delay="0">
                  <div className="work__item work__item-right">
                    <h1 className="number">03</h1>
                    <h4 className="title">{t('work.steps.three.title')}</h4>
                    <p>{t('work.steps.three.desc')}</p>
                  </div>
                  <div className="work__item work__item-right mb-0">
                    <h1 className="number">04</h1>
                    <h4 className="title">{t('work.steps.four.title')}</h4>
                    <p>{t('work.steps.four.desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="work__shape">
            <img src="/landing/img/images/features_shape.png" alt="shape" />
          </div>
        </section>

        <section className="exchange__area my-[100px]" data-aos-delay="0">
          <div className="container">
              <div className="exchange__inner-wrap">
                <div className="exchange__content">
                  <div className="icon">
                    <img src="/landing/img/images/exchange_img.png" alt="img" />
                  </div>
                  <div className="content">
                    <h4 className="title">
                      {t('uptime.titlePrefix')} <span>{t('uptime.titleHighlight')}</span>
                    </h4>
                    <p>{t('uptime.desc')}</p>
                  </div>
                </div>
              <div className="exchange__icons">
                <ul className="list-wrap">
                  <li>
                    <img src="/landing/img/icon/exchange_icon01.svg" alt="icon" />
                  </li>
                  <li>
                    <img src="/landing/img/icon/exchange_icon02.svg" alt="icon" />
                  </li>
                  <li>
                    <img src="/landing/img/icon/exchange_icon03.svg" alt="icon" />
                  </li>
                  <li>
                    <img src="/landing/img/icon/exchange_icon04.svg" alt="icon" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="crypto__area section-py-120" id="products">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-7">
                <div className="section__title text-center mb-20">
                  <span className="sub-title">{t("products.badge")}</span>
                  <h2 className="title" dangerouslySetInnerHTML={{ __html: t("products.titleHtml") }} />
                </div>
              </div>
            </div>

            <div className="row gutter-y-30 justify-content-center">
              <div className="col-lg-4 col-md-6">
                <div className="crypto__item">
                  <div className="crypto__icon">
                    <img src={asset("landing/img/icon/crypto_icon01.svg")} alt={t("products.docs.title")} loading="lazy" />
                  </div>
                  <div className="crypto__content">
                    <h2 className="title" dangerouslySetInnerHTML={{ __html: t("products.docs.titleHtml") }} />
                    <a href="#!" className="tg-btn tg-btn-two">
                      {t("products.docs.cta")}
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="crypto__item">
                  <div className="crypto__icon">
                    <img src={asset("landing/img/icon/crypto_icon02.svg")} alt={t("products.pricing.title")} loading="lazy" />
                  </div>
                  <div className="crypto__content">
                    <h2 className="title" dangerouslySetInnerHTML={{ __html: t("products.pricing.titleHtml") }} />
                    <a href="#!" className="tg-btn tg-btn-two">
                      {t("products.pricing.cta")}
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="crypto__item">
                  <div className="crypto__icon">
                    <img src={asset("landing/img/icon/crypto_icon03.svg")} alt={t("products.support.title")} loading="lazy" />
                  </div>
                  <div className="crypto__content">
                    <h2 className="title" dangerouslySetInnerHTML={{ __html: t("products.support.titleHtml") }} />
                    <a href="#!" className="tg-btn tg-btn-two">
                      {t("products.support.cta")}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="crypto__shape" aria-hidden="true">
            <img src={asset("landing/img/images/features_shape.png")} alt="" loading="lazy" />
          </div>
        </section>

            <section className="faq__area section-py-120">
    <div className="container">
      <div className="row align-items-start">
        <div className="col-lg-6">
          <div className="faq__img" data-aos-delay="0">
            <img src="/landing/img/images/faq_img.png" alt="img" />
          </div>
        </div>

        <div className="col-lg-6">
          <div className="faq__content" data-aos-delay="0">
            <div className="section__title mb-4">
              <span className="sub-title">{t("faq.badge")}</span>
              <div className="title flex items-center gap-[10px]">
                <h2>{t("faq.title")} </h2>
                <h2>{t("faq.title_2")} </h2>
                <h2>{t("faq.title_3")}</h2>
              </div>
            </div>

            <div className="space-y-4">
              {/* Q1 */}
              <div
                className="overflow-hidden transition-all duration-500"
                style={{
                  background:
                    "linear-gradient(140deg, #222325 0%, rgba(21,21,21,0) 100%)",
                  border: "1px solid var(--tg-border-1)",
                  borderRadius: "10px",
                }}
              >
                <button
                  onClick={() => toggleFaq("q1")}
                  className="w-full flex items-center justify-between px-4 py-3 text-left text-[20px] font-semibold"
                >
                  {t("faq.items.q1.question")}
                  <PlusMinusIcon open={open.q1} />
                </button>

                <div
                  className="px-4 transition-all duration-500 ease-in-out"
                  style={{ maxHeight: open.q1 ? "300px" : "0px" }}
                >
                  <div
                    className="transition-all duration-500 ease-in-out"
                    style={{
                      opacity: open.q1 ? 1 : 0,
                      transform: open.q1 ? "translateY(0)" : "translateY(-6px)",
                    }}
                  >
                    <p className="pb-2 text-white">{t("faq.items.q1.answer")}</p>
                  </div>
                </div>
              </div>

              {/* Q2 */}
              <div
                className="overflow-hidden transition-all duration-500"
                style={{
                  background:
                    "linear-gradient(140deg, #222325 0%, rgba(21,21,21,0) 100%)",
                  border: "1px solid var(--tg-border-1)",
                  borderRadius: "10px",
                }}
              >
                <button
                  onClick={() => toggleFaq("q2")}
                  className="w-full flex items-center justify-between px-4 py-3 text-left text-[20px] font-semibold"
                >
                  {t("faq.items.q2.question")}
                  <PlusMinusIcon open={open.q2} />
                </button>

                <div
                  className="px-4 transition-all duration-500 ease-in-out"
                  style={{ maxHeight: open.q2 ? "300px" : "0px" }}
                >
                  <div
                    className="transition-all duration-500 ease-in-out"
                    style={{
                      opacity: open.q2 ? 1 : 0,
                      transform: open.q2 ? "translateY(0)" : "translateY(-6px)",
                    }}
                  >
                    <p className="pb-2 text-white">{t("faq.items.q2.answer")}</p>
                  </div>
                </div>
              </div>

              {/* Q3 */}
              <div
                className="overflow-hidden transition-all duration-500"
                style={{
                  background:
                    "linear-gradient(140deg, #222325 0%, rgba(21,21,21,0) 100%)",
                  border: "1px solid var(--tg-border-1)",
                  borderRadius: "10px",
                }}
              >
                <button
                  onClick={() => toggleFaq("q3")}
                  className="w-full flex items-center justify-between px-4 py-3 text-left text-[20px] font-semibold"
                >
                  {t("faq.items.q3.question")}
                  <PlusMinusIcon open={open.q3} />
                </button>

                <div
                  className="px-4 transition-all duration-500 ease-in-out"
                  style={{ maxHeight: open.q3 ? "300px" : "0px" }}
                >
                  <div
                    className="transition-all duration-500 ease-in-out"
                    style={{
                      opacity: open.q3 ? 1 : 0,
                      transform: open.q3 ? "translateY(0)" : "translateY(-6px)",
                    }}
                  >
                    <p className="pb-2 text-white">{t("faq.items.q3.answer")}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>

        <section id="roadmap" className="roadmap__area section-py-120">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="section__title text-center mb-7" data-aos-delay="0">
                  <span className="sub-title">{t("roadmap.badge")}</span>
                  <h2 className="title">{t("roadmap.title")}</h2>
                </div>
              </div>
            </div>

            <div className="roadmap__item-wrap" data-aos-delay="300">
              <div className="row gutter-y-40">
                {roadmap.map((item, idx) => (
                  <div className="col-lg-3 col-md-6" key={item.year}>
                    <div className="roadmap__item">
                      <div className="roadmap__icon">
                        <img
                          src={`/landing/img/icon/roadmap_icon0${idx + 1}.png`}
                          alt={`Roadmap ${item.year}`}
                          loading="lazy"
                        />
                      </div>
                      <div className="roadmap__content">
                        <h3 className="title">{item.year}</h3>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="roadmap__shape" aria-hidden="true">
            <img src="/landing/img/images/features_shape.png" alt="shape" loading="lazy" />
          </div>
        </section>
      </RevealOnScroll>

      <footer className="footer__area">
        <div className="container">
          <div className="footer__top">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="footer__content">
                  <div className="footer__logo flex justify-center">
                    <a href="#home">
                      <img src="/landing/img/logo/logo.svg" alt="logo" />
                    </a>
                  </div>
                  <span className="sub-title">{t('footer.badge')}</span>
                  <h2 className="title">{t('footer.title')}</h2>
                  <div className="team__social-wrap">
                    <ul className="list-wrap">
                      <li>
                        <a href="#!">
                          <div className="shape">
                            <img src="/landing/img/icon/icons_bg.svg" alt="shape" />
                          </div>
                          <i className="icon fab fa-facebook-f" />
                        </a>
                      </li>
                      <li>
                        <a href="#!">
                          <div className="shape">
                            <img src="/landing/img/icon/icons_bg.svg" alt="shape" />
                          </div>
                          <i className="icon fab fa-twitter" />
                        </a>
                      </li>
                      <li>
                        <a href="#!">
                          <div className="shape">
                            <img src="/landing/img/icon/icons_bg.svg" alt="shape" />
                          </div>
                          <i className="icon fab fa-telegram-plane" />
                        </a>
                      </li>
                      <li>
                        <a href="#!">
                          <div className="shape">
                            <img src="/landing/img/icon/icons_bg.svg" alt="shape" />
                          </div>
                          <i className="icon fab fa-linkedin-in" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer__bottom">
            <div className="copyright-text">
              <p>{t('footer.copyright')}</p>
            </div>
          </div>
        </div>
        <div className="footer__shape">
          <img src="/landing/img/images/footer_shape01.png" alt="shape" className="alltuchtopdown" />
          <img src="/landing/img/images/footer_shape02.png" alt="shape" className="alltuchtopdown" />
        </div>
      </footer>

      </main>

        <ContactModal
          open={contactOpen}
          onClose={() => setContactOpen(false)}
          onSubmit={submitContactHandler}
        />
   </div>
  );
}
