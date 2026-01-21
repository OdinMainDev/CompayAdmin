import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";
import { Image, Nav } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

interface NavItemProps {
    setShow: Dispatch<SetStateAction<boolean>>;
    title: string;
    link: string;
    external?: boolean;
    target?: string;
    icon?: IconDefinition;
    image?: string;
    isHiddenDesktop?: boolean;
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
  }) => {
    const location = useLocation();
    const { pathname } = location;
    const { t } = useTranslation("menu");

    const navItemClassName = link === pathname ? "active" : "";

    const linkProps = external
        ? { href: link, to: '/' }
        : { as: Link, to: link };

    return (
        <Nav.Item className={navItemClassName} onClick={() => setShow(false)} >
            <Nav.Link {...linkProps} target={target} className={isHiddenDesktop ? 'hidden-nav-desktop' : ''}>
                <span>
                    {icon && (
                        <span className="sidebar-icon">
                            <FontAwesomeIcon icon={icon} />
                        </span>
                    )}
                    {image && (
                        <Image
                            src={image}
                            width={20}
                            height={20}
                            className="sidebar-icon svg-icon"
                        />
                    )}
                    <span className="sidebar-text">{t(title)}</span>
                </span>
            </Nav.Link>
        </Nav.Item>
    );
};

export default NavItem;
