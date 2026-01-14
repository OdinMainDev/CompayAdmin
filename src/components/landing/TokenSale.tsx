import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import copySvg from '@/assets/images/landing/icon/copy.svg';
import featuresShape from '@/assets/images/landing/images/features_shape.png';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TokenSale: React.FC = () => {
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
                <span className="sub-title">accessible for everyone</span>
                <h2 className="title">
                  Trading <span>platform</span> <br /> of the future!
                </h2>
              </div>
              <p>
                Webzi brings our love for cryptocurrency into Web3! Like a frog’s leap, the chart can jump at any moment. Boom!
              </p>
              <a href="#!" className="tg-btn tg-btn-two">
                purchase now
              </a>
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
                <h4 className="title">Token sale ends in:</h4>
                <div className="countdown__wrap">
                  <div className="coming-time d-flex gap-3 justify-content-center">
                    <div className="time-count day">
                      <span>{timeLeft.days}</span>
                      Days
                    </div>
                    <div className="time-count hour">
                      <span>{timeLeft.hours}</span>
                      hour
                    </div>
                    <div className="time-count min">
                      <span>{timeLeft.minutes}</span>
                      minute
                    </div>
                    <div className="time-count sec">
                      <span>{timeLeft.seconds}</span>
                      second
                    </div>
                  </div>
                </div>
                <h3 className="token__received">
                  <span>$49,222,300</span> contribution received
                </h3>
                <div className="token__progress-wrap">
                  <ul className="list-wrap token__progress-title d-flex justify-content-between mb-2">
                    <li>$5M</li>
                    <li>$99M</li>
                  </ul>
                  <div className="progress token__progress-bar">
                    <div className="progress-bar" role="progressbar" style={{ width: '50%' }} aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}></div>
                  </div>
                </div>
              </div>
              <div className="copy-text d-flex align-items-center justify-content-between">
                <mark>0x2170Ed0880ac9A755fd29B2688956BD959F933F8</mark>
                <button className="btn btn-link copy-btn" onClick={handleCopy}>
                  {copied ? '✔' : <img src={copySvg} alt="" />}
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
