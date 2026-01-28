import { Button, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import ActionClearCache from './ActionClearCache';

const FastAction = () => {
  const { t } = useTranslation();

  return (
    <div className="d-flex align-items-center">
      <Dropdown className="btn-toolbar d-none d-md-block">
        <Dropdown.Toggle as={Button} variant="outline-warning" size="sm" className="me-2 text-dark">
          {t('topbar.fast_actions.title')}
          <FontAwesomeIcon icon={faPlus} className="ms-2" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="dashboard-dropdown dropdown-menu-left mt-2 !ml-auto">
          <ActionClearCache />
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default FastAction;
