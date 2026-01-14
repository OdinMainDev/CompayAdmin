import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import cryptoIcon01 from '@/assets/images/landing/icon/crypto_icon01.svg';
import cryptoIcon02 from '@/assets/images/landing/icon/crypto_icon02.svg';
import cryptoIcon03 from '@/assets/images/landing/icon/crypto_icon03.svg';
import featuresShape from '@/assets/images/landing/images/features_shape.png';

const CryptoDirection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const items = [
    {
      icon: cryptoIcon01,
      title: 'Read our <span>white paper</span>',
      buttonText: 'open whitepaper',
    },
    {
      icon: cryptoIcon02,
      title: '1 CRN token price <span>0.00014 BTC</span>',
      buttonText: 'Buy tokens <span>(-25%)</span>',
    },
    {
      icon: cryptoIcon03,
      title: 'ICO Participants <span>370,000+</span>',
      buttonText: 'join our telegram',
    },
  ];

  return (
    <section className="crypto__area section-py-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="section__title text-center mb-80">
              <span className="sub-title">crypto direction</span>
              <h2 className="title">
                Goods & assets <span>according</span> <br /> to users interests.
              </h2>
            </div>
          </div>
        </div>
        <div className="row gutter-y-30 justify-content-center" ref={ref}>
          {items.map((item, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <motion.div
                className="crypto__item"
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="crypto__icon">
                  <img src={item.icon} alt="icon" />
                </div>
                <div className="crypto__content">
                  <h2 className="title" dangerouslySetInnerHTML={{ __html: item.title }} />
                  <a href="#!" className="tg-btn tg-btn-two" dangerouslySetInnerHTML={{ __html: item.buttonText }} />
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      <div className="crypto__shape">
        <img src={featuresShape} alt="shape" />
      </div>
    </section>
  );
};

export default CryptoDirection;
