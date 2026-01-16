import React from 'react';
import { Accordion } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import faqImg from '@/assets/images/landing/images/faq_img.png';
import { useTranslation } from 'react-i18next';
import '@/assets/scss/landing/layout/_faq.scss';

const FAQ: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { t } = useTranslation('landing');

  const faqs = [
    {
      question: t('faq.items.q1.question'),
      answer: t('faq.items.q1.answer'),
    },
    {
      question: t('faq.items.q2.question'),
      answer: t('faq.items.q2.answer'),
    },
    {
      question: t('faq.items.q3.question'),
      answer: t('faq.items.q3.answer'),
    },
  ];

  return (
    <section className="faq__area section-py-120">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <motion.div
              className="faq__img"
              ref={ref}
              initial={{ opacity: 0, x: -60 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <img src={faqImg} alt="img" />
            </motion.div>
          </div>
          <div className="col-lg-6">
            <motion.div
              className="faq__content"
              initial={{ opacity: 0, x: 60 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="section__title mb-60">
                <span className="sub-title">FAQ</span>
                <h2 className="title">
                  {t('faq.title')} <span>{t('faq.title_2')}</span> <br /> {t('faq.title_3')}
                </h2>
              </div>
              <div className="faq__wrap">
                <Accordion>
                  {faqs.map((faq, index) => (
                    <Accordion.Item key={index} eventKey={index.toString()}>
                      <Accordion.Header>{faq.question}</Accordion.Header>
                      <Accordion.Body>
                        <p>{faq.answer}</p>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
