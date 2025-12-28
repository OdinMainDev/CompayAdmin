// src/pages/landing/components/Countdown.tsx
import React, { useEffect, useMemo, useState } from "react";

export function Countdown({ target }: { target: string }) {
  const targetMs = useMemo(() => new Date(target).getTime(), [target]);
  const [left, setLeft] = useState(() => Math.max(0, targetMs - Date.now()));

  useEffect(() => {
    const id = window.setInterval(() => {
      setLeft(Math.max(0, targetMs - Date.now()));
    }, 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  const total = Math.floor(left / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  return (
    <div className="countdown-grid">
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
