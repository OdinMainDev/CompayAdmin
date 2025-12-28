// src/pages/landing/components/ScrollTopButton.tsx
import React, { useEffect, useState } from "react";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export function ScrollTopButton({
  threshold = 245,
}: {
  threshold?: number;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setOpen(y >= threshold);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const onClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className={cn("scroll__top scroll-to-target", open && "open")}
      aria-label="Scroll to top"
      data-target="html"
      onClick={onClick}
    >
      <i className="fas fa-arrow-up" aria-hidden="true" />
    </button>
  );
}
