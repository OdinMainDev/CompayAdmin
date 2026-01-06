import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCashRegister, faChartLine, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, Col, Image, ProgressBar, Row, Table } from 'react-bootstrap';
import Profile3 from '/src/assets/volt/team/profile-picture-1.jpg';

const DashboardOverview = () => {
  const counters = [
    { category: 'Customers', value: '345k', period: 'Feb 1 - Apr 1', pct: 18.2, icon: faChartLine, color: 'secondary' },
    { category: 'Revenue', value: '$43,594', period: 'Feb 1 - Apr 1', pct: 28.4, icon: faCashRegister, color: 'tertiary' },
    { category: 'Traffic Share', value: '68%', period: 'Feb 1 - Apr 1', pct: 12.4, icon: faUserShield, color: 'primary' },
  ];

  const progress = [
    { label: 'Pages / Visit', value: '4.51', pct: 50, color: 'info' },
    { label: 'Avg. Visit Duration', value: '00:03:18', pct: 80, color: 'success' },
    { label: 'Bounce Rate', value: '33.04%', pct: 33, color: 'danger' },
  ];

  const team = [
    { name: 'Bonnie Green', status: 'Online' },
    { name: 'Neil Sims', status: 'In a meeting' },
    { name: 'Lana Byrd', status: 'Offline' },
    { name: 'Thomes Lean', status: 'Online' },
  ];

  const ranking = [
    { title: 'Themesberg', score: '28,745' },
    { title: 'Volt React', score: '19,281' },
    { title: 'Pixel', score: '11,201' },
  ];

  const acquisition = [
    { label: 'Organic Search', value: '5,480' },
    { label: 'Referral', value: '4,807' },
    { label: 'Social Media', value: '3,678' },
  ];

  const visits = [
    { page: '/demo/admin/index.html', views: 3450, value: '$645', bounce: '43%' },
    { page: '/demo/admin/forms.html', views: 3010, value: '$521', bounce: '34%' },
    { page: '/demo/admin/profile.html', views: 2769, value: '$321', bounce: '23%' },
    { page: '/demo/admin/charts.html', views: 2050, value: '$189', bounce: '45%' },
  ];

  return (
    <>
      <Row className="g-4 mt-4">
        {counters.map((item) => (
          <Col xs={12} sm={6} xl={4} key={item.category}>
            <Card border="light" className="shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <h6 className="text-muted mb-1">{item.category}</h6>
                    <h3 className="mb-0">{item.value}</h3>
                    <small>{item.period}, Worldwide</small>
                  </div>
                  <div className={`icon icon-shape icon-md icon-shape-${item.color} rounded`}>
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                </div>
                <small className="text-success fw-semibold">+{item.pct}% Since last month</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-4">
        <Col xs={12} xl={8} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">Page visits</h5>
            </Card.Header>
            <Table responsive className="table-centered table-nowrap mb-0 rounded">
              <thead className="thead-light">
                <tr>
                  <th className="border-0">Page name</th>
                  <th className="border-0">Page Views</th>
                  <th className="border-0">Page Value</th>
                  <th className="border-0">Bounce rate</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((row) => (
                  <tr key={row.page}>
                    <td>{row.page}</td>
                    <td>{row.views}</td>
                    <td>{row.value}</td>
                    <td className="text-success">{row.bounce}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>

        <Col xs={12} xl={4} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">Team members</h5>
            </Card.Header>
            <Card.Body>
              {team.map((member) => (
                <div className="d-flex align-items-center mb-3" key={member.name}>
                  <Image src={Profile3} roundedCircle height={38} width={38} className="me-3" />
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{member.name}</div>
                    <small className="text-muted">{member.status}</small>
                  </div>
                  <Button size="sm" variant="outline-secondary">
                    Add
                  </Button>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-2">
        <Col xs={12} xl={8} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">Progress track</h5>
            </Card.Header>
            <Card.Body>
              {progress.map((item) => (
                <div className="mb-3" key={item.label}>
                  <div className="d-flex justify-content-between mb-1">
                    <span>{item.label}</span>
                    <span className="fw-semibold">{item.value}</span>
                  </div>
                  <ProgressBar now={item.pct} variant={item.color} className="bg-soft" />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} xl={4} className="mb-4">
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">Ranking</h5>
            </Card.Header>
            <Card.Body>
              {ranking.map((item) => (
                <div className="d-flex justify-content-between align-items-center mb-3" key={item.title}>
                  <span className="fw-semibold">{item.title}</span>
                  <span className="text-muted">{item.score}</span>
                </div>
              ))}
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">Acquisition</h5>
            </Card.Header>
            <Card.Body>
              {acquisition.map((item) => (
                <div className="d-flex justify-content-between align-items-center mb-3" key={item.label}>
                  <span>{item.label}</span>
                  <span className="fw-semibold">{item.value}</span>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardOverview;
