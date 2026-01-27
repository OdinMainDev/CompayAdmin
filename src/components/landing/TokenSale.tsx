import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import featuresShape from '@/assets/images/landing/images/features_shape.png';
import { useTranslation } from 'react-i18next';
import '@/assets/scss/landing/layout/_token.scss';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

type TokenSaleProps = {
  onOpenContact?: () => void;
};

const TokenSale: React.FC<TokenSaleProps> = ({ onOpenContact }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [copied, setCopied] = useState(false);

  const { t } = useTranslation('landing');

  useEffect(() => {
    const targetDate = new Date('2026-12-30T23:59:59').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopy = () => {
    const address = '0x2170Ed0880ac9A755fd29B2688956BD959F933F8';
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="token" className="token__area section-py-120">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <motion.div
              className="token__content"
              initial={{ opacity: 0, x: -60 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              ref={ref}
            >
              <div className="section__title mb-40">
                <span className="sub-title">{t('token.badge')}</span>
                <h2 className="title">{t('token.title')}</h2>
              </div>
              <p>{t('token.subtitle')}</p>
              <button type="button" className="tg-btn tg-btn-two" onClick={onOpenContact}>
                {t('token.cta')}
              </button>
            </motion.div>
          </div>
          <div className="col-lg-6">
            <motion.div
              className="token__wrap"
              initial={{ opacity: 0, x: 60 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="token__wrap-inner">
                <h4 className="title">{t('token.counterTitle')}</h4>
                <div className="countdown__wrap">
                  <div className="coming-time d-flex gap-3 justify-content-center">
                    <div className="time-count day">
                      <span>{timeLeft.days}</span>
                      {t('token.countdown.days')}
                    </div>
                    <div className="time-count hour">
                      <span>{timeLeft.hours}</span>
                      {t('token.countdown.hours')}
                    </div>
                    <div className="time-count min">
                      <span>{timeLeft.minutes}</span>
                      {t('token.countdown.minutes')}
                    </div>
                    <div className="time-count sec">
                      <span>{timeLeft.seconds}</span>
                      {t('token.countdown.seconds')}
                    </div>
                  </div>
                </div>
                <h3 className="token__received">{t('token.received')}</h3>
                <div className="token__progress-wrap">
                  <ul className="list-wrap token__progress-title d-flex justify-content-between mb-2">
                    <li>$1M</li>
                    <li>$100M</li>
                  </ul>
                  <div className="progress token__progress-bar">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: '50%' }}
                      aria-valuenow={50}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="copy-text d-flex align-items-center justify-content-between">
                <mark>0x2170Ed0880ac9A755fd29B2688956BD959F933F8</mark>
                <button className="btn btn-link copy-btn" onClick={handleCopy}>
                  {copied ? '✔' : '❏'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="token__shape">
        <img src={featuresShape} alt="" />
      </div>
    </section>
  );
};

export default TokenSale;
