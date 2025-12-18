import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authTotp } from '../../api/auth/totp';
import Cookies from 'js-cookie';
import { COOKIE_AUTH_TOTP_NAME } from '../../constants';
import SignInIllustration from '../../assets/volt/illustrations/signin.svg';

const TotpPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [invalidData, setInvalidData] = useState('');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const response = await authTotp(otp);

    if (!('success' in response) || !response.success) {
      setInvalidData((response as { error?: string }).error ?? t('totp_page.error'));
      setLoading(false);
      return;
    }

    Cookies.set(COOKIE_AUTH_TOTP_NAME, response.token);
    navigate('/panel/dashboard', { replace: true });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (!/^[0-9]*$/.test(value)) {
      e.target.value = value.replace(/\\D+/g, '').slice(0, 1);
      return;
    }

    if (value) {
      [...value].slice(0, 6).forEach((char, charIndex) => {
        if (inputRefs.current[index + charIndex]) {
          inputRefs.current[index + charIndex]!.value = char;
          inputRefs.current[index + charIndex + 1]?.focus();
        }
      });
    } else {
      inputRefs.current[index]!.value = '';
      inputRefs.current[index - 1]?.focus();
    }

    const updatedOtp = inputRefs.current.reduce((acc, input) => acc + (input?.value || ''), '');
    setOtp(updatedOtp);
    setInvalidData('');
  };

  return (
    <main className="min-vh-100 d-flex align-items-center bg-soft">
      <Container>
        <Row className="align-items-center justify-content-center">
          <Col lg={5} className="d-none d-lg-block">
            <img src={SignInIllustration} className="img-fluid" alt="Two-factor illustration" />
          </Col>
          <Col xs={12} lg={6} xl={5}>
            <Card className="border-0 shadow-soft">
              <Card.Body className="p-4 p-lg-5">
                <div className="text-center mb-4">
                  <div className="mb-2">
                    <img src="/landing/img/logo/logo.svg" alt={t('totp_page.title')} style={{ height: 48 }} />
                  </div>
                  <h3 className="mb-1">{t('totp_page.title')}</h3>
                  <div className="text-muted">{t('totp_page.description')}</div>
                </div>
                <Form onSubmit={handleSubmit}>
                  {invalidData && (
                    <Alert variant="danger" className="mb-3">
                      {t('totp_page.error_prefix')} {invalidData}
                    </Alert>
                  )}
                  <div className="d-flex align-items-center mb-3 gap-2 justify-content-center">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="d-inline-block">
                        <Form.Control
                          ref={(el: HTMLInputElement | null) => {
                            inputRefs.current[index] = el;
                          }}
                          className="px-2 text-center"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          onChange={(e) => handleChange(e, index)}
                        />
                      </div>
                    ))}
                  </div>
                  <Button type="submit" disabled={otp.length < 6 || loading} className="w-100">
                    {t('totp_page.submit')}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default TotpPage;
