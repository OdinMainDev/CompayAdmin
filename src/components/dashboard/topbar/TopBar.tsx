import { useState } from "react";


import Profile1 from "@/assets/images/dashboard/examples/profile-picture-1.jpg"
import { Button, Col, Container, Dropdown, Image, ListGroup, Nav, Navbar, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCog, faEnvelopeOpen, faPlus, faSignOutAlt, faTrash, faUserCircle, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const notificationsData = [
    {
        "id": 1,
        "read": false,
        "image": Profile1,
        "sender": "Jose Leos",
        "time": "a few moments ago",
        "link": "#",
        "message": `Added you to an event "Project stand-up" tomorrow at 12:30 AM.`
    },
    {
        "id": 2,
        "read": false,
        "image": Profile1,
        "sender": "Neil Sims",
        "time": "2 hrs ago",
        "link": "#",
        "message": `You've been assigned a task for "Awesome new project".`
    },
    {
        "id": 3,
        "read": false,
        "image": Profile1,
        "sender": "Roberta Casas",
        "time": "5 hrs ago",
        "link": "#",
        "message": `Tagged you in a document called "First quarter financial plans".`
    },
    {
        "id": 4,
        "read": true,
        "image": Profile1,
        "sender": "Joseph Garth",
        "time": "1 day ago",
        "link": "#",
        "message": `New message: "Hey, what's up? All set for the presentation?"`
    },
    {
        "id": 5,
        "read": true,
        "image": Profile1,
        "sender": "Jose Leos",
        "time": "2 days ago",
        "link": "#",
        "message": `New message: "We need to improve the UI/UX for the landing page."`
    },
];

const TopBar = () => {
    const [notifications, setNotifications] = useState(notificationsData);
    const areNotificationsRead = notifications.reduce((acc, notif) => acc && notif.read, true);
    const { t } = useTranslation("panel");

    const markNotificationsAsRead = () => {
    setTimeout(() => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    }, 300);
    };


    const Notification = (props: any) => {
    const { link, sender, image, time, message, read = false } = props;
    const readClassName = read ? "" : "text-danger";

    return (
        <ListGroup.Item action href={link} className="border-bottom border-light">
        <Row className="align-items-center">
            <Col className="col-auto">
            <Image src={image} className="user-avatar lg-avatar rounded-circle" />
            </Col>
            <Col className="ps-0 ms--2">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                <h4 className="h6 mb-0 text-small">{sender}</h4>
                </div>
                <div className="text-end">
                <small className={readClassName}>{time}</small>
                </div>
            </div>
            <p className="font-small mt-1 mb-0">{message}</p>
            </Col>
        </Row>
        </ListGroup.Item>
    );
    };

    return (
    <Navbar expanded className="top-bar">
        <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
            <div className="d-flex align-items-center">
            <Dropdown className="btn-toolbar d-none d-md-block">
            <Dropdown.Toggle as={Button} variant="outline-warning" size="sm" className="me-2 text-dark">
              {t("topbar.fast_actions.title")}
              <FontAwesomeIcon icon={faPlus} className="ms-2" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="dashboard-dropdown dropdown-menu-left mt-2 !ml-auto">
              <Dropdown.Item className="fw-bold">
                <FontAwesomeIcon icon={faTrash} className="me-2" /> {t("topbar.fast_actions.action_1")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
            </div>
            <Nav className="align-items-center">
            <Dropdown as={Nav.Item} onToggle={markNotificationsAsRead} >
                <Dropdown.Toggle as={Nav.Link} className="text-dark icon-notifications me-lg-3">
                <span className="icon icon-sm">
                    <FontAwesomeIcon icon={faBell} className="bell-shake" />
                    {areNotificationsRead ? null : <span className="icon-badge rounded-circle unread-notifications" />}
                </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-center mt-2 py-0">
                <ListGroup className="list-group-flush">
                    <Nav.Link href="#" className="text-center text-primary fw-bold border-bottom border-light py-3">
                    Notifications
                    </Nav.Link>

                    {notifications.map(n => <Notification key={`notification-${n.id}`} {...n} />)}

                    <Dropdown.Item className="text-center text-primary fw-bold py-3">
                    View all
                    </Dropdown.Item>
                </ListGroup>
                </Dropdown.Menu>
            </Dropdown>

            <Dropdown as={Nav.Item}>
                <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="media d-flex align-items-center">
                    <Image src={Profile1} className="user-avatar md-avatar rounded-circle" />
                    <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                    <span className="mb-0 font-small fw-bold">Bonnie Green</span>
                    </div>
                </div>
                </Dropdown.Toggle>
                <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
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

                <Dropdown.Item className="fw-bold">
                    <FontAwesomeIcon icon={faSignOutAlt} className="text-danger me-2" /> Logout
                </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            </Nav>
        </div>
        </Container>
    </Navbar>
    );
};

export default TopBar;