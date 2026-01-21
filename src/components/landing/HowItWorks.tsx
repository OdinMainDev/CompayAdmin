import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import workImg from '@/assets/images/landing/images/work_img.png';
import featuresShape from '@/assets/images/landing/images/features_shape.png';
import { useTranslation } from 'react-i18next';
import '@/assets/scss/landing/layout/_work.scss';

const HowItWorks: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { t } = useTranslation('landing');

  const leftItems = [
    {
      number: '01',
      title: t('work.steps.one.title'),
      description: t('work.steps.one.desc'),
    },
    {
      number: '02',
       title: t('work.steps.two.title'),
      description: t('work.steps.two.desc'),
    },
  ];

  const rightItems = [
    {
      number: '03',
      title: t('work.steps.three.title'),
      description: t('work.steps.three.desc'),
    },
    {
      number: '04',
      title: t('work.steps.four.title'),
      description: t('work.steps.four.desc'),
    },
  ];

  return (
    <section id="work" className="work__area section-py-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="section__title text-center mb-80">
              <span className="sub-title">{t('work.badge')}</span>
              <h2 className="title">
                {t('work.title')}
              </h2>
            </div>
          </div>
        </div>
        <div className="work__item-wrap" ref={ref}>
          <div className="work__img">
            <motion.img
              src={workImg}
              alt="img"
              className="alltuchtopdown"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <div className="row">
            <div className="col-lg-6">
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                {leftItems.map((item, index) => (
                  <div key={index} className={`work__item ${index === leftItems.length - 1 ? 'mb-0' : ''}`}>
                    <h1 className="number">{item.number}</h1>
                    <h4 className="title" dangerouslySetInnerHTML={{ __html: item.title }} />
                    <p>{item.description}</p>
                  </div>
                ))}
              </motion.div>
            </div>
            <div className="col-lg-6">
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                {rightItems.map((item, index) => (
                  <div key={index} className={`work__item work__item-right ${index === rightItems.length - 1 ? 'mb-0' : ''}`}>
                    <h1 className="number">{item.number}</h1>
                    <h4 className="title" dangerouslySetInnerHTML={{ __html: item.title }} />
                    <p>{item.description}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <div className="work__shape">
        <img src={featuresShape} alt="shape" />
      </div>
    </section>
  );
};

export default HowItWorks;
