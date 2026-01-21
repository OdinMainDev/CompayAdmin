import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import exchangeImg from '@/assets/images/landing/images/exchange_img.png';
import exchangeIcon01 from '@/assets/images/landing/icon/exchange_icon01.svg';
import exchangeIcon02 from '@/assets/images/landing/icon/exchange_icon02.svg';
import exchangeIcon03 from '@/assets/images/landing/icon/exchange_icon03.svg';
import exchangeIcon04 from '@/assets/images/landing/icon/exchange_icon04.svg';
import { useTranslation } from 'react-i18next';
import '@/assets/scss/landing/layout/_exchange.scss';

const Exchange: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { t } = useTranslation('landing');

  const icons = [
    exchangeIcon01,
    exchangeIcon02,
    exchangeIcon03,
    exchangeIcon04,
  ];

  return (
    <section className="exchange__area section-pb-120">
      <div className="container">
        <motion.div
          className="exchange__inner-wrap"
          ref={ref}
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="exchange__content">
            <div className="icon">
              <img src={exchangeImg} alt="img" />
            </div>
            <div className="content">
              <h4 className="title">
                {t('uptime.titlePrefix')} <span>{t('uptime.titleHighlight')}</span>
              </h4>
              <p>{t('uptime.desc')}</p>
            </div>
          </div>
          <div className="exchange__icons">
            <ul className="list-wrap d-flex gap-3">
              {icons.map((icon, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <img src={icon} alt="icon" />
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Exchange;
