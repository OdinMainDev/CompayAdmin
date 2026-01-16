import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import teamImg01 from '@/assets/images/landing/team/team_img01.png';
import teamImg02 from '@/assets/images/landing/team/team_img02.png';
import teamImg03 from '@/assets/images/landing/team/team_img03.png';
import teamImg04 from '@/assets/images/landing/team/team_img04.png';
import facebookIcon from '@/assets/images/landing/icon/facebook.svg';
import twitterIcon from '@/assets/images/landing/icon/twitter.svg';
import telegramIcon from '@/assets/images/landing/icon/telegram.svg';
import discordIcon from '@/assets/images/landing/icon/discord.svg';
import iconsBg from '@/assets/images/landing/icon/icons_bg.svg';
import featuresShape from '@/assets/images/landing/images/features_shape.png';
import '@/assets/scss/landing/layout/_team.scss';

const Team: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const teamMembers = [
    {
      image: teamImg01,
      position: 'founder',
      name: 'Rosalina William',
      social: 'facebook',
      icon: facebookIcon,
    },
    {
      image: teamImg02,
      position: 'ceo',
      name: 'Alonso Dowson',
      social: 'telegram',
      icon: telegramIcon,
    },
    {
      image: teamImg03,
      position: 'Designer',
      name: 'Elson Nelzoon',
      social: 'twitter',
      icon: twitterIcon,
    },
    {
      image: teamImg04,
      position: 'developer',
      name: 'Miranda Halim',
      social: 'telegram',
      icon: telegramIcon,
    },
  ];

  const socialLinks = [
    { icon: facebookIcon, url: '#!' },
    { icon: twitterIcon, url: '#!' },
    { icon: telegramIcon, url: '#!' },
    { icon: discordIcon, url: '#!' },
  ];

  return (
    <section className="team__area section-py-120">
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-5">
            <div className="team__content-wrap" ref={ref}>
              <div className="section__title mb-40">
                <span className="sub-title">our avengers</span>
                <h2 className="title">
                  Meet with <span>our</span> avengers!
                </h2>
              </div>
              <p>
                Webzi brings our love for cryptocurrency into Web3! Like a frog’s leap, the chart can jump at any moment. Boom!
              </p>
              <div className="team__social-wrap">
                <h6 className="title">Follow us</h6>
                <ul className="list-wrap d-flex gap-3">
                  {socialLinks.map((link, index) => (
                    <li key={index}>
                      <a href={link.url}>
                        <div className="shape">
                          <img src={iconsBg} alt="shape" />
                        </div>
                        <img src={link.icon} alt="icon" className="icon" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-7">
            <div className="team__item-wrap">
              <div className="row gutter-y-30">
                {teamMembers.map((member, index) => (
                  <div key={index} className="col-md-6">
                    <motion.div
                      className="team__item"
                      initial={{ opacity: 0, y: 50 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <div className="team__thumb">
                        <img src={member.image} alt="img" />
                      </div>
                      <div className="team__content">
                        <span>{member.position}</span>
                        <h3 className="title">{member.name}</h3>
                      </div>
                      <div className="social__icon">
                        <a href="#!">
                          <div className="shape">
                            <img src={iconsBg} alt="shape" />
                          </div>
                          <img src={member.icon} alt="icon" />
                        </a>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="team__shape">
        <img src={featuresShape} alt="shape" />
      </div>
    </section>
  );
};

export default Team;
