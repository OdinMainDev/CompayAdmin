import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import roadmapIcon01 from '@/assets/images/landing/icon/roadmap_icon01.png';
import roadmapIcon02 from '@/assets/images/landing/icon/roadmap_icon02.png';
import roadmapIcon03 from '@/assets/images/landing/icon/roadmap_icon03.png';
import roadmapIcon04 from '@/assets/images/landing/icon/roadmap_icon04.png';
import featuresShape from '@/assets/images/landing/images/features_shape.png';

const Roadmap: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const roadmapItems = [
    {
      icon: roadmapIcon01,
      year: '2014',
      description: 'Definitions of key terms in cryptocurrency',
    },
    {
      icon: roadmapIcon02,
      year: '2017',
      description: 'Automated tools for executing strategies',
    },
    {
      icon: roadmapIcon03,
      year: '2022',
      description: 'APIs for developers to build custom tools',
    },
    {
      icon: roadmapIcon04,
      year: '2025',
      description: 'A space for users to discuss trends',
    },
  ];

  return (
    <section id="roadmap" className="roadmap__area section-py-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <motion.div
              className="section__title text-center mb-80"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              ref={ref}
            >
              <span className="sub-title">roadmap</span>
              <h2 className="title">
                Our <span>strategy</span> & Planning
              </h2>
            </motion.div>
          </div>
        </div>
        <motion.div
          className="roadmap__item-wrap"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="row gutter-y-40">
            {roadmapItems.map((item, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <motion.div
                  className="roadmap__item"
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <div className="roadmap__icon">
                    <img src={item.icon} alt="icon" />
                  </div>
                  <div className="roadmap__content">
                    <h3 className="title">{item.year}</h3>
                    <p>{item.description}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="roadmap__shape">
        <img src={featuresShape} alt="shape" />
      </div>
    </section>
  );
};

export default Roadmap;
