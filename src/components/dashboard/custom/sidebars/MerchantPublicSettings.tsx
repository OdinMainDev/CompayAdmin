import { Button, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { MerchantService } from '@/app/api/public/merchant/service';

export default function MerchantPublicSettings() {
  const { t } = useTranslation();

  const getToken = async (): Promise<void> => {
    const response = await MerchantService.getToken();
    if (response.success) {
      alert(response.data);
    } else {
      alert('Error');
    }
  };

  const generateSecret = async (): Promise<void> => {
    const response = await MerchantService.generateSecret();
    if (response.success) {
      alert(response.data);
    } else {
      alert('Error');
    }
  };

  return (
    <Card className="shadow-sm mb-3">
      <Card.Body>
        <h6 className="mb-3">{t('sidebars.merchant.actions')}</h6>
        <div className="d-grid gap-2">
          <Button variant={'warning'} onClick={() => void getToken()}>
            {t('sidebars.merchant.get_token')}
          </Button>
          <Button variant={'warning'} onClick={() => void generateSecret()}>
            {t('sidebars.merchant.generate_secret')}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
