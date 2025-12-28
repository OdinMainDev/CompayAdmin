// src/pages/landing/components/ContactModal.tsx
import React, { useCallback, useEffect, useState } from "react";
import { submitContact } from "../contactService";

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

export function ContactModal({
  open,
  onClose,
  endpoint,
}: {
  open: boolean;
  onClose: () => void;
  endpoint: string;
}) {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) return;
    setUsername("");
    setStatus("idle");
    setMessage("");
  }, [open]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const name = username.trim();
      if (!name) return;

      setStatus("sending");
      const res = await submitContact(endpoint, { username: name });

      if (res.ok) {
        setStatus("ok");
        setMessage(res.message || "OK");
        return;
      }

      setStatus("err");
      setMessage(res.message || "Request failed");
    },
    [endpoint, username]
  );

  if (!open) return null;

  return (
    <div className="modal-backdrop custom-modal show" role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
            <i className="fas fa-times" aria-hidden="true" />
          </button>

          <div className="modal-body">
            <h3 className="title">Contact</h3>

            <form onSubmit={onSubmit} className="contact__form">
              <div className="form-grp">
                <input
                  type="text"
                  name="username"
                  placeholder="Your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={status === "sending"}
                />
              </div>

              <button type="submit" className="tg-btn tg-btn-two" disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : "Submit"}
              </button>

              {status === "ok" && <div className="form-result success">{message}</div>}
              {status === "err" && <div className="form-result error">{message}</div>}
            </form>
          </div>
        </div>
      </div>

      <div className="modal-overlay" onClick={onClose} />
    </div>
  );
}
