import { Dropdown, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { faSignOutAlt, faUserGear } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { useAuthContext } from '@/features/auth/auth-context';

const Profile = () => {
  const { t } = useTranslation('menu');
  const { getUsername } = useAuthContext();

  return (
    <Dropdown as={Nav.Item}>
      <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
        <span className="icon icon-sm">
          <FontAwesomeIcon icon={faUserGear} className="rounded-circle text-dark" />
          <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
            <span className="mb-0 font-small-i fw-bold">{getUsername()}</span>
          </div>
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
        <Dropdown.Item className="fw-bold" as={Link} to={'/dashboard/profile'}>
          <FontAwesomeIcon icon={faUser} className="me-2" /> {t('profile')}
        </Dropdown.Item>

        <Dropdown.Divider />

        <Dropdown.Item className="fw-bold" as={Link} to={'/logout'}>
          <FontAwesomeIcon icon={faSignOutAlt} className="text-danger me-2" /> {t('logout')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Profile;
