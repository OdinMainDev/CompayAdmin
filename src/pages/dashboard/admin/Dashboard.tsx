import { Col, Container, Image, Row } from 'react-bootstrap';

import NotFoundImage from '@/assets/images/dashboard/illustrations/404.svg';
import PageHeader from '@/components/dashboard/common/PageHeader';

export default function Dashboard() {
  return (
    <main>
      <PageHeader title="TEST" subtitle="TEST2" />
      <section className="vh-100 d-flex align-items-center justify-content-center">
        <Container>
          <Row>
            <Col xs={12} className="text-center d-flex align-items-center justify-content-center">
              <div>
                <Image src={NotFoundImage} className="img-fluid w-75" />
                <h1 className="text-primary mt-5">
                  ADMIN DASHBOARD <span className="fw-bolder">found</span>
                </h1>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}
