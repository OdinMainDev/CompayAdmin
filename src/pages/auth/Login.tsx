import { useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import SignInIllustration from '../../assets/volt/illustrations/signin.svg';
import FormBuilder from '../../features/FormBuilder/FormBuilder';
import { type FormSection } from '../../features/FormBuilder/entities';
import { authLogin, type LoginPayload } from '../../api/auth/login';
import Cookies from 'js-cookie';
import { COOKIE_AUTH_NAME } from '../../constants';
import type { ApiError } from '../../api/request';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<LoginPayload>({} as LoginPayload);
  const [fieldErrors, setFieldErrors] = useState<ApiError>();

  const sections: FormSection[] = [
    {
      fields: [
        {
          name: 'email',
          label: 'Email',
          type: 'text',
          placeholder: 'example@example.com',
          col: 12,
        },
        {
          name: 'password',
          label: t('password'),
          type: 'password',
          placeholder: '••••••',
          col: 12,
        },
      ],
    },
  ];

  const handleSubmit = async () => {
    setFieldErrors(undefined);
    const response = await authLogin(formData);

    if (!('success' in response) || !response.success) {
      setFieldErrors(response as ApiError);
      return;
    }

    if (response.token) {
      Cookies.set(COOKIE_AUTH_NAME, response.token);
    }
    login('admin');
    const redirectTo =
      (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname || '/panel/dashboard';
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
                  <div className="mb-3">
                    <img src="/landing/img/logo/logo_3.svg"/>
                  </div>
                  <h3 className="mb-1">{t('login_page.title')}</h3>
                  <div className="text-muted">{t('login_page.description')}</div>
                </div>
                <FormBuilder
                  sections={sections}
                  formData={formData}
                  setFormData={setFormData}
                  handleSubmit={handleSubmit}
                  submitLabel={t('login_page.submit')}
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
