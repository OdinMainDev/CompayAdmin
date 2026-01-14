import { Container } from 'react-bootstrap';

export const Marquee = () => (
  <section className="marquee__area section-pt-120">
    <Container fluid className="slider__marquee clearfix marquee-wrap p-0">
      <div className="marquee_mode marquee__group">
        <h6 className="marquee__item">You will hold the way you love Webzo</h6>
        <h6 className="marquee__item">You will hold the way you love Webzo</h6>
      </div>
    </Container>
  </section>
);
