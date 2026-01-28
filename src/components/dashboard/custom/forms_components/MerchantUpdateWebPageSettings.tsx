import '@/assets/scss/dashboard/volt.scss';

import { Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function MerchantUpdateWebPageSettings() {
  const { t } = useTranslation();

  return (
    <Col xs="12">
      <div className="position-relative">
        <hr className="bg-body-secondary mb-4 mt-5" />
        <div className="divider-content-center">{t('merchants_page.web_page_settings')}</div>
      </div>
    </Col>
  );
}
