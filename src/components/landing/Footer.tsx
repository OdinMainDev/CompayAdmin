import logo from '@/assets/images/landing/logo/logo.svg';
import iconsBg from '@/assets/images/landing/icon/icons_bg.svg';
import facebook from '@/assets/images/landing/icon/facebook.svg';
import twitter from '@/assets/images/landing/icon/twitter.svg';
import telegram from '@/assets/images/landing/icon/telegram.svg';
import discord from '@/assets/images/landing/icon/discord.svg';
import footerShape01 from '@/assets/images/landing/images/footer_shape01.png';
import footerShape02 from '@/assets/images/landing/images/footer_shape02.png';
import { Col, Container, Nav, Row } from 'react-bootstrap';

export const Footer = () => (
  <footer className="footer__area">
    <Container>
      <div className="footer__top">
        <Row className="justify-content-center">
          <Col lg={8}>
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
                <Nav as="ul" className="list-wrap">
                  <Nav.Item as="li">
                    <Nav.Link href="#!">
                      <div className="shape">
                        <img src={iconsBg} alt="shape" />
                      </div>
                      <img src={facebook} alt="icon" className="icon" />
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link href="#!">
                      <div className="shape">
                        <img src={iconsBg} alt="shape" />
                      </div>
                      <img src={twitter} alt="icon" className="icon" />
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link href="#!">
                      <div className="shape">
                        <img src={iconsBg} alt="shape" />
                      </div>
                      <img src={telegram} alt="icon" className="icon" />
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link href="#!">
                      <div className="shape">
                        <img src={iconsBg} alt="shape" />
                      </div>
                      <img src={discord} alt="icon" className="icon" />
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className="footer__bottom">
        <Row>
          <Col>
            <div className="copyright-text">
              <p>
                Copyright & design by{' '}
                <a href="https://themeforest.net/user/themeadapt" target="_blank" rel="noreferrer">
                  @ThemeAdapt
                </a>{' '}
                - 2025
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
    <div className="footer__shape">
      <img src={footerShape01} alt="shape" className="alltuchtopdown" />
      <img src={footerShape02} alt="shape" className="alltuchtopdown" />
    </div>
  </footer>
);
