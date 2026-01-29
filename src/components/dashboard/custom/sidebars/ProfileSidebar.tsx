import { Button, Card, Form, Spinner } from 'react-bootstrap';
import { User } from '@/app/entities/user';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ProfileService } from '@/app/api/profile/service';
import QRCode from 'react-qr-code';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

interface ProfileSidebarProps {
  user: User | undefined;
}

type ViewMode = 'info' | 'setup';

export default function ProfileSidebar({ user }: ProfileSidebarProps) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>('info');
  const [totpUri, setTotpUri] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!user) {
    return (
      <Card className="h-100 shadow-sm">
        <Card.Body className="d-flex align-items-center justify-content-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">{t('loading')}...</span>
          </Spinner>
        </Card.Body>
      </Card>
    );
  }

  const handleSetup2FA = async () => {
    setIsLoading(true);
    const response = await ProfileService.get2FAURI();
    setIsLoading(false);

    if (response.success) {
      setTotpUri(response.data);
      setViewMode('setup');
    }
  };

  const handleActivate2FA = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    const response = await ProfileService.activate2FA({ code });
    setIsLoading(false);

    if (response.success && user) {
      setViewMode('info');
    }
  };

  return (
    <Card className="shadow-sm mb-3">
      <Card.Body>
        <h5 className="mb-4">{t('sidebars.profile.title')}</h5>

        {viewMode === 'info' && (
          <>
            {user.is_twofa_enabled ? (
              <div className="text-center py-3">
                <div className="mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    fill="currentColor"
                    className="text-success"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                  </svg>
                </div>
                <p className="text-success fw-medium mb-0">{t('sidebars.profile.2fa_enabled')}</p>
              </div>
            ) : (
              <div className="text-center py-3">
                <div className="mb-3">
                  <FontAwesomeIcon
                    icon={faTriangleExclamation}
                    size="4x"
                    className="text-warning"
                  />
                </div>
                <p className="text-muted mb-3">{t('sidebars.profile.2fa_not_enabled')}</p>
                <Button
                  variant="primary"
                  onClick={() => void handleSetup2FA()}
                  disabled={isLoading}
                >
                  {t('sidebars.profile.setup_2fa')}
                </Button>
              </div>
            )}
          </>
        )}

        {viewMode === 'setup' && (
          <>
            <div className="text-center mb-3">
              <p className="text-muted small mb-3">{t('sidebars.profile.scan_qr_code')}</p>
              {totpUri && (
                <div className="d-flex justify-content-center p-3 bg-white rounded">
                  <QRCode value={totpUri} size={200} />
                </div>
              )}
            </div>

            <Form.Group className="mb-3">
              <Form.Label>{t('sidebars.profile.verification_code')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('sidebars.profile.enter_code')}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                disabled={isLoading}
              />
              <Form.Text className="text-muted">{t('sidebars.profile.code_hint')}</Form.Text>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                variant="success"
                onClick={() => void handleActivate2FA()}
                disabled={isLoading || !code.trim()}
              >
                {t('sidebars.profile.activate_2fa')}
              </Button>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
}
