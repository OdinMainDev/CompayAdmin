import React, { useEffect } from "react";

export function Preloader({ enabled = true }: { enabled?: boolean }) {
  useEffect(() => {
    if (!enabled) return;

    const el = document.getElementById("app-preloader");
    if (!el) return;

    const hide = () => {
      el.classList.add("is-hiding");
      window.setTimeout(() => {
        el.remove();
      }, 300);
    };

    // гарантируем, что React уже сделал первый paint
    requestAnimationFrame(() => requestAnimationFrame(hide));

    // страховка от зависонов
    const t = window.setTimeout(hide, 6000);

    return () => window.clearTimeout(t);
  }, [enabled]);

  return null;
}
