import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Col, Container, Row, Image } from "react-bootstrap";
import { LoginRequest } from "@/app/api/auth/types";
import { useAuthContext } from "@/features/auth/auth-context";
import BgImage from "@/assets/images/dashboard/illustrations/signin.svg";
import ImageLogo from "@/assets/images/logo/logo_3.svg";
import UnifiedFormBuilder from "@/features/form-builder/form-react-adapter/UnifiedFormBuilder";
import { FormSection } from "@/features/form-builder/form-core/domain/field/FormSection";
import { TextField } from "@/features/form-builder/form-core/domain/field";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('panel');
  const [formData, setFormData] = useState<LoginRequest>({} as LoginRequest);

  const { login, getRole, getFieldErrors } = useAuthContext();

  const sections: FormSection[] = [
    {
      title: '',
      fields: [
          TextField.create('email', 'Email', { placeholder: 'example@example.com' }),
          TextField.create('password', 'Password', { placeholder: '••••••' }),
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
      (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname || '/dashboard';

    navigate(role === 'admin' ? redirectTo : '/dashboard', { replace: true });
  };

  return (
      <main className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
          <Container>
            <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
              <Col className="d-flex align-items-center justify-content-center">
                <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                  <div className="text-center mb-4">
                      <Image src={ImageLogo} className="img-fluid"/>
                      <h3 className="mb-1">{t('login_page.title')}</h3>
                      <div className="text-muted">{t('login_page.description')}</div>
                  </div>
                  <UnifiedFormBuilder
                    fields={sections}
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                    submitLabel={t('login_page.submit')}
                    fieldErrors={getFieldErrors()}
                  />
                </div>
              </Col>
            </Row>
          </Container>
      </main>
    );
}



