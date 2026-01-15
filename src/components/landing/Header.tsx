import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import logo from '@/assets/images/landing/logo/logo.svg';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const [showMobile, setShowMobile] = useState(false);
  const [sticky, setSticky] = useState(false);
  const { t } = useTranslation('landing');

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 245);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setShowMobile(false);
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
                      <a href="#home"><img src={logo} alt="ComPay" /></a>
                    </div>
                    <div className="tgmenu__navbar-wrap tgmenu__main-menu d-none d-lg-flex">
                      <ul className="navigation">
                        <li><a href="#features" className="section-link" onClick={(e) => scrollToSection('features', e)}>{t("nav.features")}</a></li>
                        <li><a href="#token" className="section-link" onClick={(e) => scrollToSection('token', e)}>{t("nav.integration")}</a></li>
                        <li><a href="#work" className="section-link" onClick={(e) => scrollToSection('work', e)}>{t("nav.work")}</a></li>
                        <li><a href="#roadmap" className="section-link" onClick={(e) => scrollToSection('roadmap', e)}>{t("nav.roadmap")}</a></li>
                      </ul>
                    </div>
                    <div className="tgmenu__action">
                      <ul className="list-wrap">
                        <li className="header-btn">
                          <a href="#!" className="tg-btn">{t('hero.cta')}</a>
                        </li>
                      </ul>
                    </div>
                    <div className="mobile-nav-toggler" onClick={() => setShowMobile(true)}>
                      <i className="tg-flaticon-menu-1"></i>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`tgmobile__menu ${showMobile ? 'show' : ''}`}>
          <nav className="tgmobile__menu-box">
            <div className="close-btn" onClick={() => setShowMobile(false)}>
              <i className="tg-flaticon-close-1"></i>
            </div>
            <div className="nav-logo">
              <a href="#home"><img src={logo} alt="ComPay" /></a>
            </div>
            <div className="tgmobile__menu-outer">
              <ul className="navigation">
                <li><a href="#home" onClick={(e) => scrollToSection('home', e)}>{t("nav.home")}</a></li>
                <li><a href="#features" onClick={(e) => scrollToSection('features', e)}>{t("nav.features")}</a></li>
                <li><a href="#token" onClick={(e) => scrollToSection('token', e)}>{t("nav.token")}</a></li>
                <li><a href="#work" onClick={(e) => scrollToSection('work', e)}>{t("nav.work")}</a></li>
                <li><a href="#roadmap" onClick={(e) => scrollToSection('roadmap', e)}>{t("nav.roadmap")}</a></li>
              </ul>
            </div>
          </nav>
        </div>
        <div className={`tgmobile__menu-backdrop ${showMobile ? 'show' : ''}`} onClick={() => setShowMobile(false)}></div>
      </header>

      <motion.button
        className={`scroll__top scroll-to-target ${sticky ? 'open' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        data-target="html"
        initial={{ opacity: 0 }}
        animate={{ opacity: sticky ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <i className="fas fa-arrow-up"></i>
      </motion.button>
    </>
  );
};

export default Header;
