import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import NotFoundImage from '@/assets/images/dashboard/illustrations/404.svg';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation('panel');

  return (
    <main>
      <section className="vh-100 d-flex align-items-center justify-content-center">
        <Container>
          <Row>
            <Col xs={12} className="text-center d-flex align-items-center justify-content-center">
              <div>
                <Card.Link as={Link} to={'/'}>
                  <Image src={NotFoundImage} className="img-fluid w-75" />
                </Card.Link>
                <h1 className="text-primary mt-5">{t('error_page.404.title')}</h1>
                <p className="lead my-4">{t('error_page.404.description')}</p>
                <Link to={'/'}>
                  <Button variant="primary" className="animate-hover" type="button">
                    <FontAwesomeIcon icon={faChevronLeft} className="animate-left-3 me-3 ms-2" />
                    {t('error_page.404.cta')}
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}
