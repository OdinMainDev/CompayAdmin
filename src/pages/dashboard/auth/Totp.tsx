import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Alert, Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { COOKIE_AUTH_TOTP_NAME } from '@/constants';
import ImageLogo from '@/assets/images/logo/logo_3.svg';
import { AuthService } from '@/app/api/private/auth/service';
import { ApiError } from '@/features/api-client/types/core';

const Totp = () => {
  const { t } = useTranslation('panel');
  const navigate = useNavigate();
  const [invalidData, setInvalidData] = useState('');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const response = await AuthService.totp(otp);
    setLoading(false);

    if ('success' in response && response.success) {
      Cookies.set(COOKIE_AUTH_TOTP_NAME, response.data);
    } else {
      const errorResponse = response as ApiError;
      if (errorResponse.error) {
        setInvalidData(errorResponse.error);
      } else {
        setInvalidData('Undefined error');
      }
      return;
    }

    navigate('/panel/dashboard', { replace: true });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const { value } = e.currentTarget;
    if (!/^[0-9]*$/.test(value)) {
      e.currentTarget.value = value.replace(/\\D+/g, '').slice(0, 1);
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
    <main className="d-flex align-items-center center-h">
      <Container>
        <Row className="justify-content-center form-bg-image">
          <Col className="d-flex align-items-center justify-content-center">
            <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
              <div className="text-center mb-4">
                <Image src={ImageLogo} className="img-fluid" />
                <h3 className="mb-1">{t('totp_page.title')}</h3>
                <div className="text-muted">{t('totp_page.description')}</div>
              </div>
              <Form>
                {invalidData && (
                  <Alert variant="danger" className="mb-3">
                    {invalidData}
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
                <Button
                  type="button"
                  disabled={otp.length < 6 || loading}
                  className="w-100"
                  onClick={() => void handleSubmit()}
                >
                  {t('totp_page.submit')}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default Totp;
