import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/landing/custom.scss';
import { changeLanguage } from 'i18next';
import { I18N_LANGUAGES } from '../../constants';



type RoadmapItem = { year: string; desc: string };

const scriptList = [
  '/landing/js/vendor/jquery-3.6.0.min.js',
  '/landing/js/bootstrap.min.js',
  '/landing/js/swiper-bundle.min.js',
  '/landing/js/jquery.marquee.min.js',
  '/landing/js/ajax-form.js',
  '/landing/js/jquery.countdown.min.js',
  '/landing/js/jquery.easing.js',
  '/landing/js/wow.min.js',
  '/landing/js/aos.js',
  '/landing/js/main.js',
];

const cssLinks = [
  '/landing/css/main.css',
  '/landing/css/bootstrap.min.css',
  '/landing/css/animate.min.css',
  '/landing/css/fontawesome-all.min.css',
  '/landing/css/swiper-bundle.min.css',
  '/landing/css/default-icons.css',
  '/landing/css/default.css',
  '/landing/css/aos.css',

];

const LandingPage = () => {
  const { t, i18n } = useTranslation('landing');
  const [contact, setContact] = useState('');
  const [success, setSuccess] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const scriptsLoaded = useRef(false);
  const langDropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileLangDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!langDropdownRef.current?.contains(event.target as Node)) {
        setLangOpen(false);
      }
      if (!mobileLangDropdownRef.current?.contains(event.target as Node)) {
        setMobileLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const links = cssLinks.map((href) => {
      const id = `landing-css-${href}`;
      if (document.getElementById(id)) return null;
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
      return link;
    });
    return () => {
      links.forEach((link) => link?.parentNode?.removeChild(link));
    };
  }, []);

  const features = [
    {
      icon: '/landing/img/icon/features_icon01.png',
      title: t('features.items.accept.title'),
      desc: t('features.items.accept.desc'),
    },
    {
      icon: '/landing/img/icon/features_icon02.png',
      title: t('features.items.convert.title'),
      desc: t('features.items.convert.desc'),
    },
    {
      icon: '/landing/img/icon/features_icon03.png',
      title: t('features.items.realtime.title'),
      desc: t('features.items.realtime.desc'),
    },
    {
      icon: '/landing/img/icon/features_icon04.png',
      title: t('features.items.risk.title'),
      desc: t('features.items.risk.desc'),
    },
    {
      icon: '/landing/img/icon/features_icon05.png',
      title: t('features.items.aml.title'),
      desc: t('features.items.aml.desc'),
    },
  ];

  const products = [
    {
      icon: '/landing/img/icon/crypto_icon01.svg',
      title: t('products.docs.title'),
      titleHtml: t('products.docs.titleHtml'),
      cta: t('products.docs.cta'),
    },
    {
      icon: '/landing/img/icon/crypto_icon02.svg',
      title: t('products.pricing.title'),
      titleHtml: t('products.pricing.titleHtml'),
      cta: t('products.pricing.cta'),
    },
    {
      icon: '/landing/img/icon/crypto_icon03.svg',
      title: t('products.support.title'),
      titleHtml: t('products.support.titleHtml'),
      cta: t('products.support.cta'),
    },
  ];

  const navLinks = [
    { id: 'features', label: t('nav.features') },
    { id: 'token', label: t('nav.integration') },
    { id: 'work', label: t('nav.work') },
    { id: 'roadmap', label: t('nav.roadmap') },
  ];

  const roadmap: RoadmapItem[] = [
    t('roadmap.items.y2023', { returnObjects: true }) as RoadmapItem,
    t('roadmap.items.y2024', { returnObjects: true }) as RoadmapItem,
    t('roadmap.items.y2025', { returnObjects: true }) as RoadmapItem,
    t('roadmap.items.y2026', { returnObjects: true }) as RoadmapItem,
  ];

  useEffect(() => {
    if (scriptsLoaded.current) return;
    scriptsLoaded.current = true;

    const appendScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const tag = document.createElement('script');
        tag.src = src;
        tag.async = false;
        tag.onload = () => resolve();
        tag.onerror = () => reject();
        document.body.appendChild(tag);
      });

    const load = async () => {
      for (const src of scriptList) {
        await appendScript(src);
      }
    };

    void load()
      .then(() => {
        window.dispatchEvent(new Event('load'));
      })
      .finally(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
          preloader.style.display = 'none';
        }
      });
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contact) return;
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1500);
    setContact('');
  };

  const handleLanguageChange = (lng: string) => {
    changeLanguage(lng);
  };

  return (
    <div className="landing-wrapper tg-home-one text-white" data-bg-color="var(--tg-color-dark)">
    <div id="preloader">
      <div className="loader" />
    </div>
    
      <button className="scroll__top scroll-to-target" data-target="html" onClick={() => scrollToSection('home')}>
        <i className="fas fa-arrow-up" />
      </button>

      <header id="home">
        <div id="sticky-header" className="tg-header__area transparent-header">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="tgmenu__wrap">
                  <nav className="tgmenu__nav">
                    <div className="logo">
                      <a href="#home">
                        <img src="/landing/img/logo/logo.svg" alt="Logo" />
                      </a>
                    </div>
                    <div className="tgmenu__navbar-wrap tgmenu__main-menu d-none d-lg-flex">
                      <ul className="navigation">
                        {navLinks.map((link) => (
                          <li key={link.id}>
                            <a className="section-link" href={`#${link.id}`} onClick={() => scrollToSection(link.id)}>
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="tgmenu__action">
                      <ul className="list-wrap align-items-center">
                    <li className="me-2">
                      <div
                        className="lang-dropdown"
                        ref={langDropdownRef}
                      >
                            <button
                              type="button"
                              className={`lang-toggle${langOpen ? ' open' : ''}`}
                              onClick={() => setLangOpen((prev) => !prev)}
                              aria-haspopup="listbox"
                              aria-expanded={langOpen}
                            >
                              <span className="lang-label">{i18n.language.toUpperCase()}</span>
                              <span className="caret" aria-hidden="true" />
                            </button>
                            {langOpen && (
                              <ul className="lang-menu" role="listbox">
                                {I18N_LANGUAGES.map((lng) => (
                                  <li key={lng}>
                                    <button
                                      type="button"
                                      className={`lang-option${i18n.language === lng ? ' active' : ''}`}
                                      role="option"
                                      aria-selected={i18n.language === lng}
                                      onClick={() => {
                                        handleLanguageChange(lng);
                                        setLangOpen(false);
                                      }}
                                    >
                                      {lng.toUpperCase()}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </li>
                      </ul>
                    </div>
                    <button type="button" className="mobile-nav-toggler" aria-label={t('nav.openMenu')}>
                      <i className="fas fa-bars" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tgmobile__menu">
          <nav className="tgmobile__menu-box">
            <button type="button" className="close-btn" aria-label={t('nav.closeMenu')}>
              <i className="fas fa-times" aria-hidden="true" />
            </button>
            <div className="nav-logo">
              <a href="#home">
                <img src="/landing/img/logo/logo.svg" alt="Logo" />
              </a>
            </div>
            <div className="custom-mobile-nav">
              <ul className="navigation">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <a className="section-link" href={`#${link.id}`} onClick={() => scrollToSection(link.id)}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="tgmobile__lang"
              ref={mobileLangDropdownRef}
            >
              <button
                type="button"
                className={`lang-toggle${mobileLangOpen ? ' open' : ''}`}
                onClick={() => setMobileLangOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={mobileLangOpen}
              >
                <span className="lang-label">{i18n.language.toUpperCase()}</span>
                <span className="caret" aria-hidden="true" />
              </button>
              {mobileLangOpen && (
                <ul className="lang-menu" role="listbox">
                  {I18N_LANGUAGES.map((lng) => (
                    <li key={lng}>
                      <button
                        type="button"
                        className={`lang-option${i18n.language === lng ? ' active' : ''}`}
                        role="option"
                        aria-selected={i18n.language === lng}
                        onClick={() => {
                          handleLanguageChange(lng);
                          setMobileLangOpen(false);
                        }}
                      >
                        {lng.toUpperCase()}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="social-links">
              <ul className="list-wrap">
                <li><a href="#!"><i className="fab fa-facebook-f" /></a></li>
                <li><a href="#!"><i className="fab fa-twitter" /></a></li>
                <li><a href="#!"><i className="fab fa-instagram" /></a></li>
                <li><a href="#!"><i className="fab fa-linkedin-in" /></a></li>
                <li><a href="#!"><i className="fab fa-youtube" /></a></li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="tgmobile__menu-backdrop" />
        <div id="header-fixed-height" />
      </header>

      <main className="main-area fix">
        <section
          className="banner__area banner__bg"
          data-background="/landing/img/banner/hero_bg.svg"
          style={{ backgroundImage: 'url(/landing/img/banner/hero_bg.svg)' }}
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-7 col-lg-8 col-md-10">
                <div className="banner__content">
                  <span className="sub-title wow fadeInUp" data-wow-delay=".2s" data-wow-duration="1s">
                    {t('hero.badge')}
                  </span>
                  <h2 className="title wow fadeInUp" data-wow-delay=".4s" data-wow-duration="1s">
                    {t('hero.title')}
                  </h2>
                  <p className="wow fadeInUp" data-wow-delay=".6s" data-wow-duration="1s">
                    {t('hero.subtitle')}
                  </p>
                  <a
                    href="#contactModal"
                    className="tg-btn tg-btn-two wow fadeInUp"
                    data-wow-delay=".8s"
                    data-wow-duration="1s"
                    data-bs-toggle="modal"
                    data-bs-target="#contactModal"
                  >
                    {t('hero.cta')}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="banner__shape">
            <img src="/landing/img/banner/hero_img01.png" alt="shape" className="alltuchtopdown" />
            <img src="/landing/img/banner/hero_img02.png" alt="shape" className="rotateme" />
            <img src="/landing/img/banner/hero_img03.png" alt="shape" className="alltuchtopdown" />
            <img src="/landing/img/banner/hero_bg_shape.svg" alt="shape" className="banner__bg-shape" />
          </div>
        </section>

        <section id="features" className="features__area section-pt-120">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="section__title text-center mb-80">
                  <span className="sub-title">{t('features.badge')}</span>
                  <h2 className="title">{t('features.title')}</h2>
                </div>
              </div>
            </div>
            <div className="row gutter-y-40">
              {features.map((feature, index) => (
                <div className={`col-lg-${index < 2 ? 6 : 4}`} key={feature.title}>
                  <div className={`features__item${index >= 2 ? ' features__item-two' : ''}`}>
                    <div className="features__icon">
                      <img src={feature.icon} alt="icon" />
                    </div>
                    <div className="features__content">
                      <h4 className="title">{feature.title}</h4>
                      <p>{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="features__shape">
            <img src="/landing/img/images/features_shape.png" alt="shape" />
          </div>
        </section>

        <section className="marquee__area section-pt-120">
          <div className="slider__marquee clearfix marquee-wrap text-gray">
            <div className="marquee_mode marquee__group">
              <h6 className="marquee__item">{t('marquee.text')}</h6>
              <h6 className="marquee__item">{t('marquee.text')}</h6>
            </div>
          </div>
        </section>

        <section id="token" className="token__area section-py-120">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="token__content" data-aos="fade-right" data-aos-delay="0">
                  <div className="section__title mb-40">
                    <span className="sub-title">{t('token.badge')}</span>
                    <h2 className="title" dangerouslySetInnerHTML={{ __html: t('token.titleHtml') }} />
                  </div>
                  <p>{t('token.subtitle')}</p>
                  <a
                    href="#contactModal"
                    className="tg-btn tg-btn-two"
                    data-bs-toggle="modal"
                    data-bs-target="#contactModal"
                  >
                    {t('token.cta')}
                  </a>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="token__wrap" data-aos="fade-left" data-aos-delay="0">
                  <div className="token__wrap-inner">
                    <h4 className="title">{t('token.counterTitle')}</h4>
                    <div className="countdown__wrap">
                      <div className="coming-time" data-countdown="2026/12/30" />
                    </div>
                    <h3 className="token__received" dangerouslySetInnerHTML={{ __html: t('token.receivedHtml') }} />
                    <div className="token__progress-wrap">
                      <ul className="list-wrap token__progress-title">
                        <li>{t('token.rangeStart')}</li>
                        <li>{t('token.rangeEnd')}</li>
                      </ul>
                      <div className="progress" role="progressbar" aria-label={t('token.progressLabel')} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>
                        <div className="progress-bar" style={{ width: '50%' }} />
                      </div>
                    </div>
                  </div>
                  <div className="copy-text">
                    <mark>{t('token.copy')}</mark>
                    <button className="copy-btn" onClick={() => navigator.clipboard.writeText(t('token.copy'))}>
                      <img src="/landing/img/icon/copy.svg" alt="copy" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="token__shape">
            <img src="/landing/img/images/features_shape.png" alt="" />
          </div>
        </section>

        <div className="section-divider">
          <div className="container">
            <span />
          </div>
        </div>

        <section id="work" className="work__area section-py-120">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="section__title text-center mb-80">
                  <span className="sub-title">{t('work.badge')}</span>
                  <h2 className="title">{t('work.title')}</h2>
                </div>
              </div>
            </div>
            <div className="work__item-wrap">
              <div className="work__img">
                <img src="/landing/img/images/work_img.png" alt="img" className="alltuchtopdown" />
              </div>
              <div className="row">
                <div className="col-lg-6" data-aos="fade-right" data-aos-delay="0">
                  <div className="work__item">
                    <h1 className="number">01</h1>
                    <h4 className="title">{t('work.steps.one.title')}</h4>
                    <p>{t('work.steps.one.desc')}</p>
                  </div>
                  <div className="work__item mb-0">
                    <h1 className="number">02</h1>
                    <h4 className="title">{t('work.steps.two.title')}</h4>
                    <p>{t('work.steps.two.desc')}</p>
                  </div>
                </div>
                <div className="col-lg-6" data-aos="fade-left" data-aos-delay="0">
                  <div className="work__item work__item-right">
                    <h1 className="number">03</h1>
                    <h4 className="title">{t('work.steps.three.title')}</h4>
                    <p>{t('work.steps.three.desc')}</p>
                  </div>
                  <div className="work__item work__item-right mb-0">
                    <h1 className="number">04</h1>
                    <h4 className="title">{t('work.steps.four.title')}</h4>
                    <p>{t('work.steps.four.desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="work__shape">
            <img src="/landing/img/images/features_shape.png" alt="shape" />
          </div>
        </section>

        <section className="exchange__area section-pb-120" data-aos="fade-up" data-aos-delay="0">
          <div className="container">
              <div className="exchange__inner-wrap">
                <div className="exchange__content">
                  <div className="icon">
                    <img src="/landing/img/images/exchange_img.png" alt="img" />
                  </div>
                  <div className="content">
                    <h4 className="title">
                      {t('uptime.titlePrefix')} <span>{t('uptime.titleHighlight')}</span>
                    </h4>
                    <p>{t('uptime.desc')}</p>
                  </div>
                </div>
              <div className="exchange__icons">
                <ul className="list-wrap">
                  <li>
                    <img src="/landing/img/icon/exchange_icon01.svg" alt="icon" />
                  </li>
                  <li>
                    <img src="/landing/img/icon/exchange_icon02.svg" alt="icon" />
                  </li>
                  <li>
                    <img src="/landing/img/icon/exchange_icon03.svg" alt="icon" />
                  </li>
                  <li>
                    <img src="/landing/img/icon/exchange_icon04.svg" alt="icon" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="crypto__area section-py-120">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-7">
                <div className="section__title text-center mb-80">
                  <span className="sub-title">{t('products.badge')}</span>
                  <h2 className="title" dangerouslySetInnerHTML={{ __html: t('products.titleHtml') }} />
                </div>
              </div>
            </div>
            <div className="row gutter-y-30 justify-content-center">
              {products.map((product) => (
                <div className="col-lg-4 col-md-6" key={product.title}>
                  <div className="crypto__item">
                    <div className="crypto__icon">
                      <img src={product.icon} alt="icon" />
                    </div>
                    <div className="crypto__content">
                      <h2 className="title" dangerouslySetInnerHTML={{ __html: product.titleHtml ?? product.title }} />
                      <a href="#!" className="tg-btn tg-btn-two">
                        {product.cta}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="crypto__shape">
            <img src="/landing/img/images/features_shape.png" alt="shape" />
          </div>
        </section>

        <section className="faq__area section-py-120">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="faq__img" data-aos="fade-right" data-aos-delay="0">
                  <img src="/landing/img/images/faq_img.png" alt="img" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="faq__content" data-aos="fade-left" data-aos-delay="0">
                  <div className="section__title mb-60">
                    <span className="sub-title">{t('faq.badge')}</span>
                    <h2 className="title">{t('faq.title')}</h2>
                  </div>
                  <div className="faq__wrap">
                    <div className="accordion" id="accordionExample">
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            {t('faq.items.q1.question')}
                          </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                          <div className="accordion-body">
                            <p>{t('faq.items.q1.answer')}</p>
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            {t('faq.items.q2.question')}
                          </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                          <div className="accordion-body">
                            <p>{t('faq.items.q2.answer')}</p>
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                            {t('faq.items.q3.question')}
                          </button>
                        </h2>
                        <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                          <div className="accordion-body">
                            <p>{t('faq.items.q3.answer')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider">
          <div className="container">
            <span />
          </div>
        </div>

        <section id="roadmap" className="roadmap__area section-py-120">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="section__title text-center mb-80" data-aos="fade-up" data-aos-delay="0">
                  <span className="sub-title">{t('roadmap.badge')}</span>
                  <h2 className="title">{t('roadmap.title')}</h2>
                </div>
              </div>
            </div>
            <div className="roadmap__item-wrap" data-aos="fade-up" data-aos-delay="300">
              <div className="row gutter-y-40">
                {roadmap.map((item, idx) => (
                  <div className="col-lg-3 col-md-6" key={item.year}>
                    <div className="roadmap__item">
                      <div className="roadmap__icon">
                        <img src={`/landing/img/icon/roadmap_icon0${idx + 1}.png`} alt="icon" />
                      </div>
                      <div className="roadmap__content">
                        <h3 className="title">{item.year}</h3>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="roadmap__shape">
            <img src="/landing/img/images/features_shape.png" alt="shape" />
          </div>
        </section>
      </main>

      <footer className="footer__area">
        <div className="container">
          <div className="footer__top">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="footer__content">
                  <div className="footer__logo">
                    <a href="#home">
                      <img src="/landing/img/logo/logo.svg" alt="logo" />
                    </a>
                  </div>
                  <span className="sub-title">{t('footer.badge')}</span>
                  <h2 className="title">{t('footer.title')}</h2>
                  <div className="team__social-wrap">
                    <ul className="list-wrap">
                      <li>
                        <a href="#!">
                          <div className="shape">
                            <img src="/landing/img/icon/icons_bg.svg" alt="shape" />
                          </div>
                          <i className="icon fab fa-facebook-f" />
                        </a>
                      </li>
                      <li>
                        <a href="#!">
                          <div className="shape">
                            <img src="/landing/img/icon/icons_bg.svg" alt="shape" />
                          </div>
                          <i className="icon fab fa-twitter" />
                        </a>
                      </li>
                      <li>
                        <a href="#!">
                          <div className="shape">
                            <img src="/landing/img/icon/icons_bg.svg" alt="shape" />
                          </div>
                          <i className="icon fab fa-telegram-plane" />
                        </a>
                      </li>
                      <li>
                        <a href="#!">
                          <div className="shape">
                            <img src="/landing/img/icon/icons_bg.svg" alt="shape" />
                          </div>
                          <i className="icon fab fa-linkedin-in" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer__bottom">
            <div className="copyright-text">
              <p>{t('footer.copyright')}</p>
            </div>
          </div>
        </div>
        <div className="footer__shape">
          <img src="/landing/img/images/footer_shape01.png" alt="shape" className="alltuchtopdown" />
          <img src="/landing/img/images/footer_shape02.png" alt="shape" className="alltuchtopdown" />
        </div>
      </footer>

      <div className="modal fade contact-modal" id="contactModal" tabIndex={-1} aria-labelledby="contactModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-heading">
                <img src="/landing/img/logo/logo.svg" alt="Compay" className="modal-logo" />
                <div>
                  <h5 className="modal-title mb-1" id="contactModalLabel">
                    {t('modal.title')}
                  </h5>
                  <p className="helper-text mb-0">{t('modal.subtitle')}</p>
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label={t('landing:nav.closeMenu')}
              />
            </div>
            <div className="modal-body">
              <div id="contactSuccess" className={`alert-badge ${success ? 'show' : ''}`} role="status" aria-live="polite">
                <i className="fas fa-check-circle" aria-hidden="true" />
                <span>{t('modal.success')}</span>
              </div>
              <form id="contactForm" onSubmit={handleContactSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="contactUsername"
                    name="username"
                    placeholder={t('modal.placeholder')}
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
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
    </div>
  );
};

export default LandingPage;
