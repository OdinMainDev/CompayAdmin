import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import heroImg01 from '@/assets/images/landing/banner/hero_img01.png';
import heroImg02 from '@/assets/images/landing/banner/hero_img02.png';
import heroImg03 from '@/assets/images/landing/banner/hero_img03.png';
import heroBgShape from '@/assets/images/landing/banner/hero_bg_shape.svg';
import { useTranslation } from 'react-i18next';
import '@/assets/scss/landing/layout/_banner.scss';

type BannerProps = {
  onOpenContact?: () => void;
};

const Banner: React.FC<BannerProps> = ({ onOpenContact }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { t } = useTranslation('landing');

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  };

  const floatAnimationUp = useMemo(
    () => ({
      y: [0, -20, 0],
    }),
    [],
  );

  const floatAnimationDown = useMemo(
    () => ({
      y: [0, 20, 0],
    }),
    [],
  );

  const rotateAnimation = useMemo(
    () => ({
      rotate: 360,
    }),
    [],
  );

  const floatTransition = useMemo(
    () => ({
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    }),
    [],
  );

  const rotateTransition = useMemo(
    () => ({
      duration: 20,
      repeat: Infinity,
      ease: 'linear' as const,
    }),
    [],
  );

  return (
    <section className="banner__area banner__bg" ref={ref}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-7 col-lg-8 col-md-10">
            <div className="banner__content">
              <motion.span
                className="sub-title"
                variants={fadeInUp}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                transition={{ duration: 1, delay: 0.2 }}
              >
                {t('hero.badge')}
              </motion.span>
              <motion.h2
                className="title"
                variants={fadeInUp}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                transition={{ duration: 1, delay: 0.4 }}
              >
                {t('hero.title')}
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                transition={{ duration: 1, delay: 0.6 }}
              >
                {t('hero.subtitle')}
              </motion.p>

              <motion.button
                type="button"
                className="tg-btn tg-btn-two"
                variants={fadeInUp}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                transition={{ duration: 1, delay: 0.8 }}
                onClick={onOpenContact}
              >
                {t('hero.cta')}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="banner__shape">
        <motion.img
          key="hero-img-01"
          src={heroImg01}
          alt="shape"
          loading="lazy"
          animate={floatAnimationUp}
          transition={floatTransition}
        />
        <motion.img
          key="hero-img-02"
          src={heroImg02}
          alt="shape"
          loading="lazy"
          animate={floatAnimationDown}
          transition={floatTransition}
        />
        <motion.img
          key="hero-img-03"
          src={heroImg03}
          alt="shape"
          loading="lazy"
          animate={rotateAnimation}
          transition={rotateTransition}
        />
        <img src={heroBgShape} alt="shape" loading="lazy" />
      </div>
    </section>
  );
};

export default Banner;
