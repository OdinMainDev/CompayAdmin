import { Dropdown, Image, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import Profile1 from "@/assets/images/dashboard/examples/profile-picture-1.jpg"
import { faSignOutAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Profile = () => {
  const { t } = useTranslation("menu");

  return (
    <Dropdown as={Nav.Item}>
        <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
            <div className="media d-flex align-items-center">
                <FontAwesomeIcon icon={faUserCircle} className="user-avatar icon icon-sm rounded-circle text-dark" />
                {/* <Image src={Profile1} className="user-avatar md-avatar rounded-circle" /> */}
                <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                <span className="mb-0 font-small fw-bold">{`{USERNAME}`}</span>
                </div>
            </div>
        </Dropdown.Toggle>
        <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
            <Dropdown.Item className="fw-bold" as={Link} to={"/dashboard/profile"}>
                <FontAwesomeIcon icon={faUserCircle} className="me-2" /> {t("profile")}
            </Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item className="fw-bold" as={Link} to={'/dashboard/logout'}>
                <FontAwesomeIcon icon={faSignOutAlt} className="text-danger me-2" /> {t("logout")}
            </Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
  );
};

export default Profile;
