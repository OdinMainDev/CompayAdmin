import { useEffect } from "react";

export function Preloader() {
  useEffect(() => {
    const hide = () => {
      const el = document.getElementById("app-preloader");
      if (!el) return;
      
      setTimeout(() => {
        el.classList.add("is-hiding");
        el.style.display = 'none';
      }, 1000);
    };

    const t = setTimeout(hide, 1);
    return () => clearTimeout(t);
  }, []);

  return null;
}