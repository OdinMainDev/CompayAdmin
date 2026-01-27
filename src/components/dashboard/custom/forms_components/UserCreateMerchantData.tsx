import '@/assets/scss/dashboard/volt.scss';

import { Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function UserCreateMerchantData() {
  const { t } = useTranslation();

  return (
    <Col xs="12">
      <div className="position-relative">
        <hr className="bg-body-secondary mb-4 mt-5" />
        <div className="divider-content-center">{t('users_page.merchant_data')}</div>
      </div>
    </Col>
  );
}
