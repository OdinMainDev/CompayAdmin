import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch, SetStateAction } from 'react';
import { Image, Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

interface NavItemProps {
  setShow: Dispatch<SetStateAction<boolean>>;
  title: string;
  link: string;
  external?: boolean;
  target?: string;
  icon?: IconDefinition;
  image?: string;
  isHiddenDesktop?: boolean;
  isHiddenMobile?: boolean;
  dividerLabel?: string;
}

const NavItem: React.FC<NavItemProps> = ({
  setShow,
  title,
  link,
  external,
  target,
  icon,
  image,
  isHiddenDesktop,
  isHiddenMobile,
  dividerLabel,
}) => {
  const location = useLocation();
  const { pathname } = location;
  const { t } = useTranslation('menu');

  let navItemClassName = pathname == link ? 'active' : '';

  if (isHiddenDesktop) {
    if (navItemClassName == '') {
      navItemClassName = 'hidden-nav-desktop';
    } else {
      navItemClassName += ' hidden-nav-desktop';
    }
  }

  if (isHiddenMobile) {
    if (navItemClassName == '') {
      navItemClassName = 'hidden-nav-mobile';
    } else {
      navItemClassName += ' hidden-nav-mobile';
    }
  }

  const linkProps = external ? { href: link, to: '/' } : { as: Link, to: link };

  return (
    <>
      {dividerLabel && (
        <>
          <p className="my-0 mt-3">{t(dividerLabel)}</p>
          <hr className="my-0 mb-3 border-indigo" />
        </>
      )}
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link {...linkProps} target={target}>
          <span>
            {icon && (
              <span className="sidebar-icon">
                <FontAwesomeIcon icon={icon} />
              </span>
            )}
            {image && (
              <Image src={image} width={20} height={20} className="sidebar-icon svg-icon" />
            )}
            <span className="sidebar-text">{t(title)}</span>
          </span>
        </Nav.Link>
      </Nav.Item>
    </>
  );
};

export default NavItem;
