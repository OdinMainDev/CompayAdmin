import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import featuresIcon01 from '@/assets/images/landing/icon/features_icon01.png';
import featuresIcon02 from '@/assets/images/landing/icon/features_icon02.png';
import featuresIcon03 from '@/assets/images/landing/icon/features_icon03.png';
import featuresIcon04 from '@/assets/images/landing/icon/features_icon04.png';
import featuresIcon05 from '@/assets/images/landing/icon/features_icon05.png';
import featuresShape from '@/assets/images/landing/images/features_shape.png';
import { useTranslation } from 'react-i18next';

const Features: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { t } = useTranslation('landing');

  const features = [
    {
      icon: featuresIcon01,
      title:  t('features.items.accept.title'),
      description: t('features.items.accept.desc'),
      colClass: 'col-lg-6'
    },
    {
      icon: featuresIcon02,
      title: t('features.items.convert.title'),
      description: t('features.items.convert.desc'),
      colClass: 'col-lg-6'
    },
    {
      icon: featuresIcon03,
      title: t('features.items.realtime.title'),
      description: t('features.items.realtime.desc'),
      colClass: 'col-lg-4'
    },
    {
      icon: featuresIcon04,
      title: t('features.items.risk.title'),
      description: t('features.items.risk.desc'),
      colClass: 'col-lg-4'
    },
    {
      icon: featuresIcon05,
      title: t('features.items.aml.title'),
      description: t('features.items.aml.desc'),
      colClass: 'col-lg-4'
    },
  ];

  return (
    <section id="features" className="features__area section-pt-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="section__title text-center mb-80">
              <span className="sub-title">{t('features.badge')}</span>
              <h2 className="title">
                {t('features.title')}
              </h2>
            </div>
          </div>
        </div>
        <div className="row gutter-y-40" ref={ref}>
          {features.map((feature, index) => (
            <div key={index} className={`${feature.colClass} col-md-6`}>
              <motion.div
                className={`features__item ${feature.colClass.includes('4') ? 'features__item-two' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="features__icon">
                  <img src={feature.icon} alt="icon" />
                </div>
                <div className="features__content">
                  <h4 className="title" dangerouslySetInnerHTML={{ __html: feature.title }} />
                  <p>{feature.description}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      <div className="features__shape">
        <img src={featuresShape} alt="shape" />
      </div>
    </section>
  );
};

export default Features;
