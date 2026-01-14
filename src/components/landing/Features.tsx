import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import featuresIcon01 from '@/assets/images/landing/icon/features_icon01.png';
import featuresIcon02 from '@/assets/images/landing/icon/features_icon02.png';
import featuresIcon03 from '@/assets/images/landing/icon/features_icon03.png';
import featuresIcon04 from '@/assets/images/landing/icon/features_icon04.png';
import featuresIcon05 from '@/assets/images/landing/icon/features_icon05.png';
import featuresShape from '@/assets/images/landing/images/features_shape.png';

const Features: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: featuresIcon01,
      title: 'Crypto <span>management</span>',
      description: 'Automated identity verification and anti-money',
      colClass: 'col-lg-6'
    },
    {
      icon: featuresIcon02,
      title: 'Crypto <span>exchange</span>',
      description: 'A built-in explorer to track transactions',
      colClass: 'col-lg-6'
    },
    {
      icon: featuresIcon03,
      title: 'Real-time <span>data</span>',
      description: 'Global reach with content available in multiple',
      colClass: 'col-lg-4'
    },
    {
      icon: featuresIcon04,
      title: 'Advanced <span>trading</span>',
      description: 'Visual dashboards for trade performance',
      colClass: 'col-lg-4'
    },
    {
      icon: featuresIcon05,
      title: 'Blockchain <span>compliance</span>',
      description: 'Exportable reports for tax and accounting purposes',
      colClass: 'col-lg-4'
    },
  ];

  return (
    <section id="features" className="features__area section-pt-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="section__title text-center mb-80">
              <span className="sub-title">accessible for everyone</span>
              <h2 className="title">
                Crypto <span>development</span> accessible
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
