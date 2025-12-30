// src/pages/landing/components/RevealOnScroll.tsx
import React, { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  /** Селектор для поиска элементов. По умолчанию ищем все секции */
  selector?: string;
  /** Отступ снизу (px), при котором начинается анимация */
  offset?: number;
};

export function RevealOnScroll({
  children,
  selector = "section",
  offset = 100,
}: Props) {
  useEffect(() => {
    // Находим все целевые элементы (например, <section>) на странице
    const elements = document.querySelectorAll(selector);
    
    if (elements.length === 0) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ease = "cubic-bezier(0.2, 1, 0.3, 1)";

    // 1. Инициализация стилей для всех найденных элементов
    elements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.opacity = "0";
      htmlEl.style.transform = "translate3d(0, 50px, 0) scale(0.98)";
      htmlEl.style.filter = "blur(8px)";
      htmlEl.style.transition = `
        opacity 1100ms ${ease}, 
        transform 1300ms ${ease}, 
        filter 1100ms ${ease}
      `;
      htmlEl.style.willChange = "opacity, transform, filter";
    });

    // 2. Настройка наблюдателя
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translate3d(0, 0, 0) scale(1)";
            el.style.filter = "blur(0)";
            
            // Убираем will-change после завершения анимации
            setTimeout(() => {
              el.style.willChange = "auto";
            }, 1400);

            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: `0px 0px -${offset}px 0px`,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selector, offset]);

  // Возвращаем детей без дополнительного div-контейнера
  return <>{children}</>;
}