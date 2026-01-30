import { ApiAdminService } from '@/app/api/private/api/service';
import '@/assets/scss/dashboard/volt.scss';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function ActionClearCache() {
  const { t } = useTranslation();

  const handleClick = async () => {
    try {
      await ApiAdminService.clearCache();
    } catch {
      console.error('Failed to copy');
    }
  };

  return (
    <Dropdown.Item className="fw-bold" onClick={() => void handleClick()}>
      <FontAwesomeIcon icon={faTrash} className="me-2" /> {t('topbar.fast_actions.action_1')}
    </Dropdown.Item>
  );
}
