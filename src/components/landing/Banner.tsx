import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Import images
import heroImg01 from '@/assets/images/landing/banner/hero_img01.png';
import heroImg02 from '@/assets/images/landing/banner/hero_img02.png';
import heroImg03 from '@/assets/images/landing/banner/hero_img03.png';
import heroBgShape from '@/assets/images/landing/banner/hero_bg_shape.svg';
import envelopeIcon from '@/assets/images/landing/icon/envelope.svg';

const Banner: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  };

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
                animate={inView ? "visible" : "hidden"}
                transition={{ duration: 1, delay: 0.2 }}
              >
                Built on web3. Powered by You
              </motion.span>
              <motion.h2
                className="title"
                variants={fadeInUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                transition={{ duration: 1, delay: 0.4 }}
              >
                The <span>future</span> of leverage is here
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                transition={{ duration: 1, delay: 0.6 }}
              >
                Leverage on any tokens with a protocol trusted with billions for its performance and reliability.
              </motion.p>

              <motion.form
                action="#"
                className="banner__form"
                variants={fadeInUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <label htmlFor="email">
                  <img src={envelopeIcon} alt="" />
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Business email"
                />
                <button type="submit" className="tg-btn">get early access</button>
              </motion.form>

              <motion.span
                className="banner__content-bottom"
                variants={fadeInUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                transition={{ duration: 1, delay: 0.8 }}
              >
                Start monitoring for free or <a href="#!">msg us!</a>
              </motion.span>
            </div>
          </div>
        </div>
      </div>

      <div className="banner__shape">
        <motion.img
          src={heroImg01}
          alt="shape"
          animate={{ y: [0, -20, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.img
          src={heroImg02}
          alt="shape"
          animate={{ y: [0, 20, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.img
          src={heroImg03}
          alt="shape"
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <img src={heroBgShape} alt="shape" />
      </div>
    </section>
  );
};

export default Banner;
