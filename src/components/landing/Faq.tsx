import faqImg from '@/assets/images/landing/images/faq_img.png';
import { Accordion, Col, Container, Row } from 'react-bootstrap';

export const Faq = () => (
  <section className="faq__area section-py-120">
    <Container>
      <Row className="align-items-center">
        <Col lg={6}>
          <div className="faq__img" data-aos="fade-right" data-aos-delay="0">
            <img src={faqImg} alt="img" />
          </div>
        </Col>
        <Col lg={6}>
          <div className="faq__content" data-aos="fade-left" data-aos-delay="0">
            <div className="section__title mb-60">
              <span className="sub-title">faq & ans</span>
              <h2 className="title">
                Get every <span>single</span> <br /> answer
              </h2>
            </div>
            <div className="faq__wrap">
              <Accordion defaultActiveKey="0" id="accordionExample">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    Main purpose of a cryptocurrency
                  </Accordion.Header>
                  <Accordion.Body>
                    <p>
                      The private key, stored securely in the wallet, allows you to sign
                      transactions and prove ownership of the funds cryptocurrency wallet.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>How can I make refund?</Accordion.Header>
                  <Accordion.Body>
                    <p>
                      The private key, stored securely in the wallet, allows you to sign
                      transactions and prove ownership of the funds cryptocurrency wallet.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    How do they operate on blockchain?
                  </Accordion.Header>
                  <Accordion.Body>
                    <p>
                      The private key, stored securely in the wallet, allows you to sign
                      transactions and prove ownership of the funds cryptocurrency wallet.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  </section>
);
