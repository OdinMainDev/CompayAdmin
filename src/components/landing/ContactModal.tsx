import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '@/assets/scss/landing/layout/_modal.scss';

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
};

const ContactModal: React.FC<ContactModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation('landing');
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const successTimeout = useRef<number | null>(null);
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKey);
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 0);

    return () => {
      window.removeEventListener('keydown', handleKey);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove('modal-open');
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) return;
    setContact('');
    setSubmitted(false);
  }, [open]);

  useEffect(
    () => () => {
      if (successTimeout.current) {
        window.clearTimeout(successTimeout.current);
      }
    },
    [],
  );

  if (!open) return null;

  const handleBackdrop = (event: React.MouseEvent<HTMLDivElement>) => {
    if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = contact.trim();
    if (!value) return;
    setContact('');
    setSubmitted(true);
    if (successTimeout.current) {
      window.clearTimeout(successTimeout.current);
    }
    successTimeout.current = window.setTimeout(() => {
      setSubmitted(false);
    }, 2500);
  };

  return (
    <>
      <div
        className="modal fade contact-modal show"
        id="contactModal"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contactModalLabel"
        aria-hidden="false"
        style={{ display: 'block' }}
        onMouseDown={handleBackdrop}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content"
            ref={dialogRef}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-heading">
                <h5 className="modal-title mb-1" id="contactModalLabel">
                  {t('modal.title')}
                </h5>
                <p className="helper-text mb-0">{t('modal.subtitle')}</p>
              </div>
              <button
                type="button"
                className="btn-close"
                aria-label={t('nav.closeMenu')}
                onClick={onClose}
              />
            </div>
            <div className="modal-body">
              <div
                className={`alert-badge${submitted ? ' show' : ''}`}
                role="status"
                aria-live="polite"
              >
                <span>{t('modal.success')}</span>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    ref={inputRef}
                    type="text"
                    className="form-control"
                    name="contact"
                    placeholder={t('modal.placeholder')}
                    aria-label={t('modal.placeholder')}
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="tg-btn">
                  {t('modal.submit')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default ContactModal;
