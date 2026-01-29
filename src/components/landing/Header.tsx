import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import logo from '@/assets/images/logo/logo.svg';
import { useTranslation } from 'react-i18next';
import { I18N_LANGUAGES } from '@/constants';
import { changeLanguage } from '@/i18n';
import '@/assets/scss/landing/layout/_header.scss';

type HeaderProps = {
  onOpenContact?: () => void;
};

const Header: React.FC<HeaderProps> = ({ onOpenContact }) => {
  const [showMobile, setShowMobile] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const { t, i18n } = useTranslation('landing');

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 245);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('mobile-menu-visible', showMobile);
    return () => {
      document.body.classList.remove('mobile-menu-visible');
    };
  }, [showMobile]);

  useEffect(() => {
    if (!langOpen && !mobileLangOpen) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('.lang-dropdown')) return;
      setLangOpen(false);
      setMobileLangOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [langOpen, mobileLangOpen]);

  useEffect(() => {
    if (!showMobile) {
      setMobileLangOpen(false);
    }
  }, [showMobile]);

  const scrollToSection = (sectionId: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
    setShowMobile(false);
    setLangOpen(false);
    setMobileLangOpen(false);
  };

  const handleLanguageChange = (lng: string) => {
    if (i18n.language === lng) {
      setLangOpen(false);
      setMobileLangOpen(false);
      return;
    }
    changeLanguage(lng);
    setLangOpen(false);
    setMobileLangOpen(false);
  };

  const handleOpenContact = () => {
    if (onOpenContact) {
      onOpenContact();
    }
  };

  return (
    <>
      <header id="home">
        <div className={`tg-header__area transparent-header ${sticky ? 'sticky-menu' : ''}`}>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="tgmenu__wrap">
                  <nav className="tgmenu__nav">
                    <div className="logo">
                      <a href="#home">
                        <img src={logo} alt="ComPay" />
                      </a>
                    </div>
                    <div className="tgmenu__navbar-wrap tgmenu__main-menu d-none d-lg-flex">
                      <ul className="navigation">
                        <li>
                          <a
                            href="#features"
                            className="section-link"
                            onClick={(e) => scrollToSection('features', e)}
                          >
                            {t('nav.features')}
                          </a>
                        </li>
                        <li>
                          <a
                            href="#token"
                            className="section-link"
                            onClick={(e) => scrollToSection('token', e)}
                          >
                            {t('nav.integration')}
                          </a>
                        </li>
                        <li>
                          <a
                            href="#work"
                            className="section-link"
                            onClick={(e) => scrollToSection('work', e)}
                          >
                            {t('nav.work')}
                          </a>
                        </li>
                        <li>
                          <a
                            href="#roadmap"
                            className="section-link"
                            onClick={(e) => scrollToSection('roadmap', e)}
                          >
                            {t('nav.roadmap')}
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="tgmenu__action">
                      <ul className="list-wrap">
                        <li>
                          <div className="lang-dropdown">
                            <button
                              type="button"
                              className={`lang-toggle${langOpen ? ' open' : ''}`}
                              onClick={() => setLangOpen((prev) => !prev)}
                              aria-haspopup="listbox"
                              aria-expanded={langOpen}
                              aria-label={t('nav.language')}
                            >
                              <span className="lang-label">{i18n.language.toUpperCase()}</span>
                              <span className="caret" aria-hidden="true" />
                            </button>
                            {langOpen && (
                              <ul
                                className="lang-menu"
                                role="listbox"
                                aria-label={t('nav.language')}
                              >
                                {I18N_LANGUAGES.map((lng) => (
                                  <li key={lng}>
                                    <button
                                      type="button"
                                      className={`lang-option${i18n.language === lng ? ' active' : ''}`}
                                      role="option"
                                      aria-selected={i18n.language === lng}
                                      onClick={() => handleLanguageChange(lng)}
                                    >
                                      {lng.toUpperCase()}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </li>
                        <li className="header-btn">
                          <button type="button" className="tg-btn" onClick={handleOpenContact}>
                            {t('hero.cta')}
                          </button>
                        </li>
                      </ul>
                    </div>
                    <button
                      type="button"
                      className="mobile-nav-toggler"
                      aria-label={t('nav.openMenu')}
                      aria-expanded={showMobile}
                      onClick={() => setShowMobile((prev) => !prev)}
                    >
                      <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
                        <path
                          d="M3 6h18M3 12h18M3 18h18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="tgmobile__menu">
          <nav className="tgmobile__menu-box">
            <button
              type="button"
              className="close-btn"
              aria-label={t('nav.closeMenu')}
              onClick={() => setShowMobile(false)}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6l-12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div className="nav-logo">
              <a href="#home">
                <img src={logo} alt="ComPay" />
              </a>
            </div>
            <div className="tgmobile__menu-outer">
              <ul className="navigation">
                <li>
                  <a href="#home" onClick={(e) => scrollToSection('home', e)}>
                    {t('nav.home')}
                  </a>
                </li>
                <li>
                  <a href="#features" onClick={(e) => scrollToSection('features', e)}>
                    {t('nav.features')}
                  </a>
                </li>
                <li>
                  <a href="#token" onClick={(e) => scrollToSection('token', e)}>
                    {t('nav.integration')}
                  </a>
                </li>
                <li>
                  <a href="#work" onClick={(e) => scrollToSection('work', e)}>
                    {t('nav.work')}
                  </a>
                </li>
                <li>
                  <a href="#roadmap" onClick={(e) => scrollToSection('roadmap', e)}>
                    {t('nav.roadmap')}
                  </a>
                </li>
              </ul>
            </div>
            <div className="tgmobile__lang">
              <div className="lang-dropdown">
                <button
                  type="button"
                  className={`lang-toggle${mobileLangOpen ? ' open' : ''}`}
                  onClick={() => setMobileLangOpen((prev) => !prev)}
                  aria-haspopup="listbox"
                  aria-expanded={mobileLangOpen}
                  aria-label={t('nav.language')}
                >
                  <span className="lang-label">{i18n.language.toUpperCase()}</span>
                  <span className="caret" aria-hidden="true" />
                </button>
                {mobileLangOpen && (
                  <ul className="lang-menu" role="listbox" aria-label={t('nav.language')}>
                    {I18N_LANGUAGES.map((lng) => (
                      <li key={lng}>
                        <button
                          type="button"
                          className={`lang-option${i18n.language === lng ? ' active' : ''}`}
                          role="option"
                          aria-selected={i18n.language === lng}
                          onClick={() => handleLanguageChange(lng)}
                        >
                          {lng.toUpperCase()}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </nav>
        </div>
        <div className="tgmobile__menu-backdrop" onClick={() => setShowMobile(false)}></div>
      </header>

      <motion.button
        className={`scroll__top scroll-to-target ${sticky ? 'open' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        data-target="html"
        initial={{ opacity: 0 }}
        animate={{ opacity: sticky ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <i className="fas fa-arrow-up">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
            <path d="M12 6.75c.2 0 .39.08.53.22l5 5a.75.75 0 1 1-1.06 1.06L12.75 8.56V18a.75.75 0 0 1-1.5 0V8.56l-3.72 3.47a.75.75 0 1 1-1.06-1.06l5-5a.75.75 0 0 1 .53-.22z"></path>
          </svg>
        </i>
      </motion.button>
    </>
  );
};

export default Header;
