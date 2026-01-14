import copy from '@/assets/images/landing/icon/copy.svg';
import featuresShape from '@/assets/images/landing/images/features_shape.png';
import { Button, Col, Container, ListGroup, ProgressBar, Row } from 'react-bootstrap';

export const Token = () => (
  <section id="token" className="token__area section-py-120">
    <Container>
      <Row className="align-items-center">
        <Col lg={6}>
          <div className="token__content" data-aos="fade-right" data-aos-delay="0">
            <div className="section__title mb-40">
              <span className="sub-title">accessible for everyone</span>
              <h2 className="title">
                Trading <span>platform</span> <br /> of the future!
              </h2>
            </div>
            <p>
              Webzi brings our love for cryptocurrency into Web3! Like a frog's leap,
              the chart can jump at any moment. Boom!
            </p>
            <Button href="#!" className="tg-btn tg-btn-two">
              purchase now
            </Button>
          </div>
        </Col>
        <Col lg={6}>
          <div className="token__wrap" data-aos="fade-left" data-aos-delay="0">
            <div className="token__wrap-inner">
              <h4 className="title">Token sale ends in:</h4>
              <div className="countdown__wrap">
                <div className="coming-time" data-countdown="2026/12/30"></div>
              </div>
              <h3 className="token__received">
                <span>$49,222,300</span> contribution received
              </h3>
              <div className="token__progress-wrap">
                <ListGroup as="ul" className="list-wrap token__progress-title">
                  <ListGroup.Item as="li">$5M</ListGroup.Item>
                  <ListGroup.Item as="li">$99M</ListGroup.Item>
                </ListGroup>
                <ProgressBar now={50} aria-label="Token sale progress" />
              </div>
            </div>
            <div className="copy-text">
              <mark>0x2170Ed0880ac9A755fd29B2688956BD959F933F8</mark>
              <Button type="button" className="copy-btn">
                <img src={copy} alt="" />
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
    <div className="token__shape">
      <img src={featuresShape} alt="" />
    </div>
  </section>
);
