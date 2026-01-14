import cryptoIcon01 from '@/assets/images/landing/icon/crypto_icon01.svg';
import cryptoIcon02 from '@/assets/images/landing/icon/crypto_icon02.svg';
import cryptoIcon03 from '@/assets/images/landing/icon/crypto_icon03.svg';
import featuresShape from '@/assets/images/landing/images/features_shape.png';
import { Button, Col, Container, Row } from 'react-bootstrap';

export const Crypto = () => (
  <section className="crypto__area section-py-120">
    <Container>
      <Row className="justify-content-center">
        <Col lg={7}>
          <div className="section__title text-center mb-80">
            <span className="sub-title">crypto direction</span>
            <h2 className="title">
              Goods & assets <span>according</span> <br /> to users interests.
            </h2>
          </div>
        </Col>
      </Row>
      <Row className="gutter-y-30 justify-content-center">
        <Col lg={4} md={6}>
          <div className="crypto__item">
            <div className="crypto__icon">
              <img src={cryptoIcon01} alt="icon" />
            </div>
            <div className="crypto__content">
              <h2 className="title">
                Read our <span>white paper</span>
              </h2>
              <Button href="#!" className="tg-btn tg-btn-two">
                open whitepaper
              </Button>
            </div>
          </div>
        </Col>
        <Col lg={4} md={6}>
          <div className="crypto__item">
            <div className="crypto__icon">
              <img src={cryptoIcon02} alt="icon" />
            </div>
            <div className="crypto__content">
              <h2 className="title">
                1 CRN token price <span>0.00014 BTC</span>
              </h2>
              <Button href="#!" className="tg-btn tg-btn-two">
                Buy tokens <span>(-25%)</span>
              </Button>
            </div>
          </div>
        </Col>
        <Col lg={4} md={6}>
          <div className="crypto__item">
            <div className="crypto__icon">
              <img src={cryptoIcon03} alt="icon" />
            </div>
            <div className="crypto__content">
              <h2 className="title">
                ICO Participants <span>370,000+</span>
              </h2>
              <Button href="#!" className="tg-btn tg-btn-two">
                join our telegram
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
    <div className="crypto__shape">
      <img src={featuresShape} alt="shape" />
    </div>
  </section>
);
