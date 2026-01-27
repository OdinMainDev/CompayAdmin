import { Button, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const FastAction = () => {
  const { t } = useTranslation('panel');

  return (
    <div className="d-flex align-items-center">
      <Dropdown className="btn-toolbar d-none d-md-block">
        <Dropdown.Toggle as={Button} variant="outline-warning" size="sm" className="me-2 text-dark">
          {t('topbar.fast_actions.title')}
          <FontAwesomeIcon icon={faPlus} className="ms-2" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="dashboard-dropdown dropdown-menu-left mt-2 !ml-auto">
          <Dropdown.Item className="fw-bold">
            <FontAwesomeIcon icon={faTrash} className="me-2" /> {t('topbar.fast_actions.action_1')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default FastAction;
