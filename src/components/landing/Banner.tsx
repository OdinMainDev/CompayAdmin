import heroBg from '@/assets/images/landing/banner/hero_bg.svg';
import envelope from '@/assets/images/landing/icon/envelope.svg';
import heroImg01 from '@/assets/images/landing/banner/hero_img01.png';
import heroImg02 from '@/assets/images/landing/banner/hero_img02.png';
import heroImg03 from '@/assets/images/landing/banner/hero_img03.png';
import heroBgShape from '@/assets/images/landing/banner/hero_bg_shape.svg';
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';

export const Banner = () => (
  <section className="banner__area banner__bg" style={{backgroundImage: heroBg}}>
    <Container>
      <Row className="justify-content-center">
        <Col xl={7} lg={8} md={10}>
          <div className="banner__content">
            <span className="sub-title wow fadeInUp" data-wow-delay=".2s" data-wow-duration="1s">
              Built on web3. Powered by You
            </span>
            <h2 className="title wow fadeInUp" data-wow-delay=".4s" data-wow-duration="1s">
              The <span>future</span> of leverage is here
            </h2>
            <p className="wow fadeInUp" data-wow-delay=".6s" data-wow-duration="1s">
              Leverage on any tokens with a protocol trusted with billions for its performance and
              reliability.
            </p>
            <Form
              action="#"
              className="banner__form wow fadeInUp"
              data-wow-delay=".8s"
              data-wow-duration="1s"
            >
              <InputGroup>
                <InputGroup.Text as="label" htmlFor="email">
                  <img src={envelope} alt="" />
                </InputGroup.Text>
                <Form.Control type="email" id="email" placeholder="Business email" />
                <Button type="submit" className="tg-btn">
                  get early access
                </Button>
              </InputGroup>
            </Form>
            <span
              className="banner__content-bottom wow fadeInUp"
              data-wow-delay=".8s"
              data-wow-duration="1s"
            >
              Start monitoring for free or <a href="#!">msg us!</a>
            </span>
          </div>
        </Col>
      </Row>
    </Container>
    <div className="banner__shape">
      <img src={heroImg01} alt="shape" className="alltuchtopdown" />
      <img src={heroImg02} alt="shape" className="rotateme" />
      <img src={heroImg03} alt="shape" className="alltuchtopdown" />
      <img src={heroBgShape} alt="shape" className="banner__bg-shape" />
    </div>
  </section>
);
