import featuresIcon01 from '@/assets/images/landing/icon/features_icon01.png';
import featuresIcon02 from '@/assets/images/landing/icon/features_icon02.png';
import featuresIcon03 from '@/assets/images/landing/icon/features_icon03.png';
import featuresIcon04 from '@/assets/images/landing/icon/features_icon04.png';
import featuresIcon05 from '@/assets/images/landing/icon/features_icon05.png';
import featuresShape from '@/assets/images/landing/images/features_shape.png';
import { Col, Container, Row } from 'react-bootstrap';

export const Features = () => (
  <section id="features" className="features__area section-pt-120">
    <Container>
      <Row className="justify-content-center">
        <Col lg={6}>
          <div className="section__title text-center mb-80">
            <span className="sub-title">accessible for everyone</span>
            <h2 className="title">
              Crypto <span>development</span> accessible
            </h2>
          </div>
        </Col>
      </Row>
      <Row className="gutter-y-40">
        <Col lg={6}>
          <div className="features__item">
            <div className="features__icon">
              <img src={featuresIcon01} alt="icon" />
            </div>
            <div className="features__content">
              <h4 className="title">
                Crypto <span>management</span>
              </h4>
              <p>Automated identity verification and anti-money</p>
            </div>
          </div>
        </Col>
        <Col lg={6}>
          <div className="features__item">
            <div className="features__icon">
              <img src={featuresIcon02} alt="icon" />
            </div>
            <div className="features__content">
              <h4 className="title">
                Crypto <span>exchange</span>
              </h4>
              <p>A built-in explorer to track transactions</p>
            </div>
          </div>
        </Col>
        <Col lg={4}>
          <div className="features__item features__item-two">
            <div className="features__icon">
              <img src={featuresIcon03} alt="icon" />
            </div>
            <div className="features__content">
              <h4 className="title">
                Real-time <span>data</span>
              </h4>
              <p>Global reach with content available in multiple</p>
            </div>
          </div>
        </Col>
        <Col lg={4}>
          <div className="features__item features__item-two">
            <div className="features__icon">
              <img src={featuresIcon04} alt="icon" />
            </div>
            <div className="features__content">
              <h4 className="title">
                Advanced <span>trading</span>
              </h4>
              <p>Visual dashboards for trade performance</p>
            </div>
          </div>
        </Col>
        <Col lg={4}>
          <div className="features__item features__item-two">
            <div className="features__icon">
              <img src={featuresIcon05} alt="icon" />
            </div>
            <div className="features__content">
              <h4 className="title">
                Blockchain <span>compliance</span>
              </h4>
              <p>Exportable reports for tax and accounting purposes</p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
    <div className="features__shape">
      <img src={featuresShape} alt="shape" />
    </div>
  </section>
);
