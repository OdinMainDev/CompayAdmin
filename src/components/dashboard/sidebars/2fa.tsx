import { useState } from 'react';
import { Alert, Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';

const TwofaSidebar = () => {
  const [qrUrl] = useState<string>('asdasd');
  const [showModal, setShowModal] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const handleOpen = () => {
    setToken('');
    setError('');
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = () => {
    setIsSubmit(true);
  };

  return (
    <>
      <Col className="col-xl-3 col-12">
        <Row className="g-3 xxl-0 h-100">
          <Col xs={12} md={5} xxl={12}>
            <Card className="h-100">
              <Card.Body className="">
                <h5 className="mb-5">{t('2fa_title')}</h5>
                <>
                  <Alert variant="danger" className="mt-5">
                    {t('2fa_text')}
                  </Alert>
                  {qrUrl && qrUrl.length > 0 && (
                    <Button variant="primary" onClick={handleOpen}>
                      {t('2fa_enable')}
                    </Button>
                  )}
                </>

                <Alert variant="success" className="mt-5">
                  {t('2fa_already_enabled')}
                </Alert>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('2fa_setup')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t('2fa_how_setup')}</p>
          {qrUrl && qrUrl.length > 0 && (
            <div className="mb-3 text-center">
              <QRCode value={qrUrl} size={200} />
            </div>
          )}
          <Form>
            <Form.Group controlId="formToken" className="mb-3 mt-1">
              <Form.Label>{t('code')}</Form.Label>
              <Form.Control
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="123456"
              />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button
              variant="success"
              type="button"
              onClick={handleSubmit}
              disabled={isSubmit}
              className="me-2"
            >
              {t('submit')}
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              {t('cancel')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TwofaSidebar;
