import logo from '@/assets/images/landing/logo/logo.svg';
import iconsBg from '@/assets/images/landing/icon/icons_bg.svg';
import facebook from '@/assets/images/landing/icon/facebook.svg';
import twitter from '@/assets/images/landing/icon/twitter.svg';
import telegram from '@/assets/images/landing/icon/telegram.svg';
import discord from '@/assets/images/landing/icon/discord.svg';
import footerShape01 from '@/assets/images/landing/images/footer_shape01.png';
import footerShape02 from '@/assets/images/landing/images/footer_shape02.png';

export const Footer = () => (
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
                <ul className="list-wrap">
                  <li>
                    <a href="#!">
                      <div className="shape">
                        <img src={iconsBg} alt="shape" />
                      </div>
                      <img src={facebook} alt="icon" className="icon" />
                    </a>
                  </li>
                  <li>
                    <a href="#!">
                      <div className="shape">
                        <img src={iconsBg} alt="shape" />
                      </div>
                      <img src={twitter} alt="icon" className="icon" />
                    </a>
                  </li>
                  <li>
                    <a href="#!">
                      <div className="shape">
                        <img src={iconsBg} alt="shape" />
                      </div>
                      <img src={telegram} alt="icon" className="icon" />
                    </a>
                  </li>
                  <li>
                    <a href="#!">
                      <div className="shape">
                        <img src={iconsBg} alt="shape" />
                      </div>
                      <img src={discord} alt="icon" className="icon" />
                    </a>
                  </li>
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
            <a href="https://themeforest.net/user/themeadapt" target="_blank" rel="noreferrer">
              @ThemeAdapt
            </a>{' '}
            - 2025
          </p>
        </div>
      </div>
    </div>
    <div className="footer__shape">
      <img src={footerShape01} alt="shape" className="alltuchtopdown" />
      <img src={footerShape02} alt="shape" className="alltuchtopdown" />
    </div>
  </footer>
);
