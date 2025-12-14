import { useState } from 'react';
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import SignInIllustration from '../../assets/volt/illustrations/signin.svg';
import FormBuilder from '../../features/FormBuilder/FormBuilder';
import { type FormSection } from '../../features/FormBuilder/entities';
import { authLogin, type LoginPayload } from '../../api/auth/login';
import Cookies from 'js-cookie';
import { COOKIE_AUTH_NAME } from '../../constants';
import type { ApiError } from '../../api/request';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginPayload>({
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<ApiError>();
  const [loading, setLoading] = useState(false);

  const sections: FormSection[] = [
    {
      fields: [
        { name: 'email', label: 'Email', type: 'text', placeholder: 'email@example.com', required: true, col: 12 },
        { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true, col: 12 },
      ],
    },
  ];

  const handleSubmit = () => {
    const doSubmit = async () => {
      setFieldErrors(undefined);
      setLoading(true);
      const response = await authLogin(formData);
      setLoading(false);

      if (!('success' in response) || !response.success) {
        setFieldErrors(response as ApiError);
        return;
      }

      if (response.token) {
        Cookies.set(COOKIE_AUTH_NAME, response.token);
      }
      login('admin');
      const redirectTo =
        (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname ||
        '/panel/dashboard';
      navigate(redirectTo, { replace: true });
    };

    void doSubmit();
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
                  <h3 className="mb-1">Авторизация</h3>
                  <div className="text-muted">Введите учетные данные для входа</div>
                </div>
                <FormBuilder
                  sections={sections}
                  formData={formData}
                  setFormData={setFormData}
                  handleSubmit={handleSubmit}
                  submitLabel={loading ? <Spinner size="sm" animation="border" /> : 'Войти'}
                  fieldErrors={fieldErrors?.errors}
                  title=""
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default LoginPage;
