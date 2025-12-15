import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCloudUploadAlt, faCog, faEnvelopeOpen, faLanguage, faPlus, faSignOutAlt, faTasks, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { Col, Button, Dropdown, Row, Image, ListGroup, Nav, Navbar } from 'react-bootstrap';
import { useAuth } from '../../auth/useAuth';
import { useTranslation } from 'react-i18next';
import { type LanguageCode, languages, persistLanguage } from '../../config/i18n';
import Avatar from '../../assets/volt/team/profile-picture-1.jpg';
import ProfileAvatar from '../../assets/images/profile/avatar.svg';

const Topbar = () => {
  const { logout } = useAuth();
  const { i18n } = useTranslation();

  const notifications = useMemo(
    () => [
      { id: 1, sender: 'Bonnie Green', message: 'Uploaded new version of Volt React Dashboard', time: '2 hrs ago', read: false },
      { id: 2, sender: 'Robert Lewis', message: 'New message: Hello, world!', time: '3 hrs ago', read: false },
      { id: 3, sender: 'Admin', message: 'Product update is available', time: '5 hrs ago', read: true },
    ],
    [],
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLanguageChange = (lng: LanguageCode) => {
    i18n.changeLanguage(lng).catch(() => undefined);
    persistLanguage(lng);
  };

  return (
    <Navbar variant="dark" expanded className="ps-3 pe-3 py-2 topbar-filled">
      <div className="d-flex justify-content-between w-100">
        <div className="d-flex align-items-center">
          <Dropdown className="btn-toolbar d-none d-md-block">
            <Dropdown.Toggle as={Button} variant="outline-warning" size="sm" className="me-2 text-dark">
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              New Task
            </Dropdown.Toggle>
            <Dropdown.Menu className="dashboard-dropdown dropdown-menu-left mt-2">
              <Dropdown.Item className="fw-bold">
                <FontAwesomeIcon icon={faTasks} className="me-2" /> New Task
              </Dropdown.Item>
              <Dropdown.Item className="fw-bold">
                <FontAwesomeIcon icon={faCloudUploadAlt} className="me-2" /> Upload Files
              </Dropdown.Item>
              <Dropdown.Item className="fw-bold">
                <FontAwesomeIcon icon={faUserShield} className="me-2" /> Preview Security
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <Nav className="align-items-center ms-auto">
          <Dropdown as={Nav.Item} className="me-lg-2 topbar-lang">
            <Dropdown.Toggle as={Nav.Link} className="text-dark p-0 d-flex align-items-center">
              <span className="icon icon-sm">
                <FontAwesomeIcon icon={faLanguage} />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="lang-dropdown-menu mt-2">
              {languages.map((lng) => (
                <Dropdown.Item
                  key={lng}
                  active={i18n.language === lng}
                  onClick={() => handleLanguageChange(lng)}
                >
                  {lng.toUpperCase()}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown as={Nav.Item}>
            <Dropdown.Toggle as={Nav.Link} className="text-dark icon-notifications me-lg-3">
              <span className="icon icon-sm">
                <FontAwesomeIcon icon={faBell} className="bell-shake" />
                {unreadCount > 0 && <span className="icon-badge rounded-circle unread-notifications" />}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-center mt-2 py-0">
              <ListGroup className="list-group-flush">
                <Nav.Link href="#" className="text-center text-primary fw-bold border-bottom border-light py-3">
                  Notifications
                </Nav.Link>
                {notifications.map((n) => (
                  <ListGroup.Item key={n.id} action className="border-bottom border-light">
                    <Row className="align-items-center">
                      <Col className="col-auto">
                        <Image src={Avatar} className="user-avatar lg-avatar rounded-circle" />
                      </Col>
                      <Col className="ps-0 ms--2">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="h6 mb-0 text-small">{n.sender}</h6>
                          <small className={n.read ? '' : 'text-danger'}>{n.time}</small>
                        </div>
                        <p className="font-small mt-1 mb-0 text-muted">{n.message}</p>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
                <Dropdown.Item className="text-center text-primary fw-bold py-3">
                  View all
                </Dropdown.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown as={Nav.Item}>
            <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
              <div className="media d-flex align-items-center">
                <Image src={ProfileAvatar} className="user-avatar md-avatar rounded-circle border border-1 border-white" />
                <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                  <span className="mb-0 font-small fw-bold">Bonnie Green</span>
                </div>
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="user-dropdown dropdown-menu-right">
              <Dropdown.Item className="fw-bold">
                <FontAwesomeIcon icon={faUserCircle} className="me-2" /> My Profile
              </Dropdown.Item>
              <Dropdown.Item className="fw-bold">
                <FontAwesomeIcon icon={faCog} className="me-2" /> Settings
              </Dropdown.Item>
              <Dropdown.Item className="fw-bold">
                <FontAwesomeIcon icon={faEnvelopeOpen} className="me-2" /> Messages
              </Dropdown.Item>
              <Dropdown.Item className="fw-bold">
                <FontAwesomeIcon icon={faUserShield} className="me-2" /> Support
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="fw-bold" onClick={logout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="text-danger me-2" /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </div>
    </Navbar>
  );
};

export default Topbar;
