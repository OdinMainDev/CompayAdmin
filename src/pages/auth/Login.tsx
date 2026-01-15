import { useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import SignInIllustration from '../../assets/volt/illustrations/signin.svg';
import { useTranslation } from 'react-i18next';
import UnifiedFormBuilder from '../../features/form-platform/packages/form-react-adapter/UnifiedFormBuilder';
import type { RawFormSection } from '../../features/form-platform/packages/form-core/domain/field/RawFormSection';
import { useAuthContext } from '../../app/api/auth/auth-context';
import type { LoginRequest } from '../../app/api/types/auth';


const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<LoginRequest>({} as LoginRequest);

  const { login, getRole, getFieldErrors } = useAuthContext();

  const sections: RawFormSection[] = [
    {
      title: '',
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
    const response = await login(formData);
    if (!response) {
      return;
    }
    const role = getRole();
    const redirectTo =
      (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname || '/panel/dashboard';

    navigate(role === 'admin' ? redirectTo : '/panel/dashboard', { replace: true });
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
                <UnifiedFormBuilder
                  json={sections}
                  formData={formData}
                  setFormData={setFormData}
                  handleSubmit={handleSubmit}
                  submitLabel={t('login_page.submit')}
                  fieldErrors={getFieldErrors()}
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
