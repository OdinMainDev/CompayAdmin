// src/pages/landing/components/ActiveMenuOnScroll.tsx
import React, { useEffect } from "react";

type Props = {
  menuSelector?: string;
  linkSelector?: string;
  activeClass?: string;
  headerOffset?: number;
};

export function ActiveMenuOnScroll({
  menuSelector = ".tgmenu__navbar-wrap",
  linkSelector = "a.section-link",
  activeClass = "active",
  headerOffset = 120,
}: Props) {
  useEffect(() => {
    const menu = document.querySelector<HTMLElement>(menuSelector);
    if (!menu) return;

    const getLinks = () =>
      Array.from(menu.querySelectorAll<HTMLAnchorElement>(linkSelector));

    const setActiveLi = (li: HTMLLIElement | null) => {
      const links = getLinks();
      const fallback = links[0]?.closest("li") ?? null;
      const active = li ?? fallback;

      for (const a of links) {
        const item = a.closest("li");
        if (!item) continue;
        item.classList.toggle(activeClass, item === active);
      }
    };

    let raf = 0;

    const computeActiveByScroll = () => {
      const links = getLinks();
      if (!links.length) return;

      const y = (window.scrollY || document.documentElement.scrollTop || 0) + headerOffset;

      let activeLi: HTMLLIElement | null = null;

      for (const a of links) {
        const href = a.getAttribute("href") || "";
        if (!href.startsWith("#")) continue;

        const section = document.querySelector<HTMLElement>(href);
        if (!section) continue;

        if (section.offsetTop <= y) {
          activeLi = a.closest("li");
        } else {
          break;
        }
      }

      setActiveLi(activeLi);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        computeActiveByScroll();
      });
    };

    // Клик: только если реально кликнули по ссылке меню
    const onMenuClick = (e: MouseEvent) => {
      if (e.button !== 0) return; // только ЛКМ
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const a = target.closest(linkSelector) as HTMLAnchorElement | null;
      if (!a) return;

      const href = a.getAttribute("href") || "";
      if (!href.startsWith("#")) return;

      // мгновенно подсветить выбранный пункт
      setActiveLi(a.closest("li"));

      // а потом синхронизироваться с реальной позицией после smooth-scroll
      requestAnimationFrame(() => computeActiveByScroll());
      window.setTimeout(computeActiveByScroll, 250);
      window.setTimeout(computeActiveByScroll, 650);
    };

    computeActiveByScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    menu.addEventListener("click", onMenuClick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      menu.removeEventListener("click", onMenuClick);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [menuSelector, linkSelector, activeClass, headerOffset]);

  return null;
}
