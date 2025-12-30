// src/pages/landing/components/ContactModal.tsx
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (username: string) => Promise<boolean> | boolean; // true = success
};


export function ContactModal({ open, onClose, onSubmit }: Props) {
  const { t } = useTranslation("landing");
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [contact, setContact] = useState("");
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    const tid = window.setTimeout(() => inputRef.current?.focus(), 0);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(tid);
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove("modal-open");
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) return;
    setContact("");
    setSuccess(false);
    setSending(false);
  }, [open]);

  if (!open) return null;

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = contact.trim();
    if (!v || sending) return;

    setSending(true);
    setSuccess(false);

    const ok = await onSubmit(v);

    setSending(false);
    setSuccess(Boolean(ok));
    if (ok) setContact("");
  };

  return (
    <>
      <div
        className="modal fade contact-modal show overflow-hidden"
        id="contactModal"
        tabIndex={-1}
        aria-labelledby="contactModalLabel"
        aria-hidden="false"
        style={{ display: "block" }}
        onMouseDown={handleBackdrop}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" ref={dialogRef} onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-heading">
                <img src="/landing/img/logo/logo.svg" alt="Compay" className="modal-logo" />
                <div>
                  <h5 className="modal-title mb-1" id="contactModalLabel">
                    {t("modal.title")}
                  </h5>
                  <p className="helper-text mb-0">{t("modal.subtitle")}</p>
                </div>
              </div>
              <button type="button" className="btn-close" aria-label={t("nav.closeMenu")} onClick={onClose} />
            </div>

            <div className="modal-body">
              <div id="contactSuccess" className={`alert-badge ${success ? "show" : ""}`} role="status" aria-live="polite">
                <i className="fas fa-check-circle" aria-hidden="true" />
                <span>{t("modal.success")}</span>
              </div>

              <form id="contactForm" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    ref={inputRef}
                    type="text"
                    className="form-control"
                    id="contactUsername"
                    name="username"
                    placeholder={t("modal.placeholder")}
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    disabled={sending}
                  />
                </div>
                <button type="submit" className="tg-btn" disabled={sending}>
                  {sending ? t("modal.sending", "Sending...") : t("modal.submit")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" />
    </>
  );
}
