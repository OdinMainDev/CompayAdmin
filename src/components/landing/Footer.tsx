import React from 'react';
import { motion } from 'framer-motion';
import logo from '@/assets/images/landing/logo/logo.svg';
import facebookIcon from '@/assets/images/landing/icon/facebook.svg';
import twitterIcon from '@/assets/images/landing/icon/twitter.svg';
import telegramIcon from '@/assets/images/landing/icon/telegram.svg';
import discordIcon from '@/assets/images/landing/icon/discord.svg';
import iconsBg from '@/assets/images/landing/icon/icons_bg.svg';
import footerShape01 from '@/assets/images/landing/images/footer_shape01.png';
import footerShape02 from '@/assets/images/landing/images/footer_shape02.png';

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: facebookIcon, url: '#!' },
    { icon: twitterIcon, url: '#!' },
    { icon: telegramIcon, url: '#!' },
    { icon: discordIcon, url: '#!' },
  ];

  return (
    <footer className="footer__area">
      <div className="container">
        <div className="footer__top">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="footer__content">
                <div className="footer__logo">
                  <a href="index.html">
                    <img src={logo} alt="logo" />
                  </a>
                </div>
                <span className="sub-title">Built on web3. Powered by You</span>
                <h2 className="title">
                  Join with our <span>future</span> of Webzo currency
                </h2>
                <div className="team__social-wrap">
                  <ul className="list-wrap d-flex gap-3 justify-content-center">
                    {socialLinks.map((link, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <a href={link.url}>
                          <div className="shape">
                            <img src={iconsBg} alt="shape" />
                          </div>
                          <img src={link.icon} alt="icon" className="icon" />
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <div className="copyright-text">
            <p>
              Copyright & design by{' '}
              <a href="https://themeforest.net/user/themeadapt" target="_blank" rel="noopener noreferrer">
                @ThemeAdapt
              </a>{' '}
              - 2025
            </p>
          </div>
        </div>
      </div>
      <div className="footer__shape">
        <motion.img
          src={footerShape01}
          alt="shape"
          className="alltuchtopdown"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.img
          src={footerShape02}
          alt="shape"
          className="alltuchtopdown"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </footer>
  );
};

export default Footer;
