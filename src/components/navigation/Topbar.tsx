// src/components/topbar/topbar.tsx
import React, { useEffect, useMemo, useId } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faCloudUploadAlt,
  faCog,
  faEnvelopeOpen,
  faPlus,
  faSignOutAlt,
  faTasks,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';

import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { Col, Button, Dropdown, Row, Image, ListGroup, Nav, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Avatar from '../../assets/volt/team/profile-picture-1.jpg';
import ProfileAvatar from '../../assets/images/profile/ava.svg';
import { changeLanguage } from '../../i18n';
import { I18N_DEFAULT_LANGUAGE, I18N_LANGUAGES, I18N_STORAGE_KEY, type I18NLanguage } from '../../constants';
import { useAuthContext } from '../../app/api/auth/auth-context';

const isLang = (v: unknown): v is I18NLanguage =>
  typeof v === 'string' && (I18N_LANGUAGES as readonly string[]).includes(v);

const normLang = (v: string | undefined | null): I18NLanguage => {
  const base = (v || '').toLowerCase().split('-')[0];
  return (isLang(base) ? base : I18N_DEFAULT_LANGUAGE) as I18NLanguage;
};

const FlagRU = ({ className = '', title = 'Русский' }: { className?: string; title?: string }) => (
  <svg viewBox="0 0 3 2" role="img" aria-label={title} className={className}>
    <title>{title}</title>
    <rect width="3" height="2" fill="#ffffff" />
    <rect width="3" height="0.6667" y="0.6667" fill="#0039A6" />
    <rect width="3" height="0.6667" y="1.3333" fill="#D52B1E" />
  </svg>
);

const FlagUS = ({ className = '', title = 'English' }: { className?: string; title?: string }) => {
  const pid = useId();
  const patternId = `usStars-${pid}`;

  return (
    <svg viewBox="0 0 19 10" role="img" aria-label={title} className={className}>
      <title>{title}</title>

      <rect width="19" height="10" fill="#ffffff" />

      {Array.from({ length: 13 }).map((_, i) =>
        i % 2 === 0 ? (
          <rect key={i} x="0" y={(10 / 13) * i} width="19" height={10 / 13} fill="#B22234" />
        ) : null,
      )}

      <defs>
        <pattern id={patternId} width="0.55" height="0.55" patternUnits="userSpaceOnUse">
          <circle cx="0.275" cy="0.275" r="0.09" fill="#ffffff" />
        </pattern>
      </defs>

      <rect x="0" y="0" width="7.6" height="5.4" fill="#3C3B6E" />
      <rect x="0" y="0" width="7.6" height="5.4" fill={`url(#${patternId})`} opacity="0.95" />
    </svg>
  );
};

const LANG_UI: Record<I18NLanguage, { label: string; Flag: React.FC<{ className?: string; title?: string }> }> = {
  ru: { label: 'Русский', Flag: FlagRU },
  en: { label: 'English', Flag: FlagUS },
};

const Topbar = () => {
  const { logout, user } = useAuthContext();
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

  useEffect(() => {
    const stored = localStorage.getItem(I18N_STORAGE_KEY);
    const storedLang = isLang(stored) ? stored : null;

    const current = normLang(i18n.resolvedLanguage || i18n.language);

    if (storedLang) {
      if (storedLang !== current) changeLanguage(storedLang);
      return;
    }

    localStorage.setItem(I18N_STORAGE_KEY, I18N_DEFAULT_LANGUAGE);
    if (current !== I18N_DEFAULT_LANGUAGE) changeLanguage(I18N_DEFAULT_LANGUAGE);
  }, [i18n.language, i18n.resolvedLanguage]);

  const currentLang = normLang(i18n.resolvedLanguage || i18n.language || I18N_DEFAULT_LANGUAGE);
  const CurrentFlag = LANG_UI[currentLang].Flag;

  const handleLanguageChange = (lng: I18NLanguage) => {
    localStorage.setItem(I18N_STORAGE_KEY, lng);
    changeLanguage(lng);
  };

  return (
    <Navbar variant="dark" expanded className="ps-3 pe-3 py-2 topbar-filled">
      <div className="d-flex justify-content-between w-100 min-[768px]:px-3">
        <div className="d-flex align-items-center">
          <Dropdown className="btn-toolbar d-none d-md-block">
            <Dropdown.Toggle as={Button} variant="outline-warning" size="sm" className="me-2 text-dark">
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              New Task
            </Dropdown.Toggle>
            <Dropdown.Menu className="dashboard-dropdown dropdown-menu-left mt-2 !ml-auto">
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
          {/* Language */}
          <Dropdown as={Nav.Item} className="me-lg-2 topbar-lang">
            <Dropdown.Toggle
              as={Nav.Link}
              className="text-dark p-0 d-flex align-items-center !no-underline"
              aria-label="Language"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center">
                <CurrentFlag className="h-4 w-6 rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.10)]" />
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu
              align="end"
              className="lang-dropdown-menu mt-2 text-center py-0 !min-w-[120px] !rounded-md !border !border-slate-200 !bg-white !shadow-lg !mr-auto"
            >
              {(I18N_LANGUAGES as readonly I18NLanguage[]).map((lng) => {
                const active = currentLang === lng;
                const { Flag, label } = LANG_UI[lng];

                return (
                  <Dropdown.Item
                    key={lng}
                    active={active}
                    onClick={() => handleLanguageChange(lng)}
                    className={[
                      '!flex items-center gap-2 rounded px-2 py-3 text-sm !text-slate-900',
                      'hover:!bg-slate-50 hover:!text-slate-900',
                      active ? '!bg-slate-100 font-semibold' : '',
                    ].join(' ')}
                  >
                    <Flag className="h-4 w-6 rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.10)]" />
                    <span className="leading-none">{label}</span>
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>

          {/* Notifications */}
          <Dropdown as={Nav.Item}>
            <Dropdown.Toggle as={Nav.Link} className="text-dark icon-notifications px-3 pb-0">
              <span className="icon icon-sm !min-w-[1.3rem] !w-[1.3rem] !h-[1.3rem] !min-h-[1.3rem]">
                <FontAwesomeIcon icon={faBell} className="bell-shake" />
                {unreadCount > 0 && <span className="icon-badge rounded-circle unread-notifications" />}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-center mt-2 py-0 !ml-auto">
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
                <Dropdown.Item className="text-center text-primary fw-bold py-3">View all</Dropdown.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>

          {/* User */}
          <Dropdown as={Nav.Item}>
            <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
              <div className="media d-flex align-items-center">
                <Image
                  src={ProfileAvatar}
                  className="user-avatar !min-w-[1.5rem] !w-[1.5rem] !h-[1.5rem] !min-h-[1.5rem] md-avatar rounded-circle border border-1 border-white"
                />
                <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                  <span className="mb-0 font-small fw-bold">{user?.username ?? 'User'}</span>
                </div>
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="user-dropdown dropdown-menu-right !min-w-[150px]">
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
