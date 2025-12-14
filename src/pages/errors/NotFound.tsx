import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import Illustration from '../../assets/volt/illustrations/404.svg';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-vh-100 d-flex align-items-center bg-soft">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <Card className="shadow-soft border-0">
              <Card.Body className="p-5 text-center">
                <img src={Illustration} alt="404" className="img-fluid mb-4" />
                <h2 className="h4 mb-2">{t('notfound.title')}</h2>
                <p className="text-muted mb-4">{t('notfound.description')}</p>
                <Link to="/panel/dashboard">
                  <Button variant="primary">{t('notfound.cta')}</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default NotFound;
