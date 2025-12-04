import { FormEvent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserRole, useAuth } from '../../auth/AuthContext';
import { useTranslation } from 'react-i18next';
import SignInIllustration from '../../assets/volt/illustrations/signin.svg';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>('admin');
  const { t } = useTranslation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(role);
    const redirectTo =
      (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname ||
      '/panel/dashboard';
    navigate(redirectTo, { replace: true });
  };

  return (
    <main className="min-vh-100 d-flex align-items-center bg-soft">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="d-none d-lg-block">
            <div className="p-4">
              <img src={SignInIllustration} className="img-fluid" alt="Sign in illustration" />
            </div>
          </Col>
          <Col xs={12} lg={6}>
            <Card className="border-0 shadow-soft">
              <Card.Body className="p-4 p-lg-5">
                <div className="text-center mb-4">
                  <span className="badge bg-primary-soft text-primary mb-3 px-3 py-2 rounded-pill">
                    Volt React Dashboard
                  </span>
                  <h3 className="mb-1">{t('login_page.title')}</h3>
                  <div className="text-muted">{t('login_page.description')}</div>
                </div>
                <Form onSubmit={handleSubmit} className="mt-3">
                  <Form.Group className="mb-3" controlId="login-email">
                    <Form.Label>{t('email')}</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control type="email" placeholder={t('enter_email')} required />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="login-password">
                    <Form.Label>{t('password')}</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faLock} />
                      </InputGroup.Text>
                      <Form.Control type="password" placeholder={t('enter_password')} required />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-4" controlId="login-role">
                    <Form.Label>{t('topbar.role')}</Form.Label>
                    <Form.Select
                      value={role}
                      onChange={(event) => setRole(event.target.value as UserRole)}
                    >
                      <option value="admin">Admin</option>
                      <option value="dev">Dev</option>
                    </Form.Select>
                    <Form.Text className="text-muted">{t('login_role_hint')}</Form.Text>
                  </Form.Group>
                  <div className="d-grid">
                    <Button variant="primary" type="submit">
                      {t('login_page.submit')}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default LoginPage;
