import { Nav, Tab, Row, Col } from 'react-bootstrap';
import { UnifiedFieldRegistry } from '../UnifiedFieldRegistry';
import type { IField } from '../../form-core/domain/field/IField';

export function TabRenderer(field: IField<null, TabFieldExtra>) {
  const tabs = field.extra.repeater_items;

  return (
    <Tab.Container defaultActiveKey={tabs[0]?.key}>
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            {tabs.map(tab => (
              <Nav.Item key={tab.key}>
                <Nav.Link eventKey={tab.key}>{tab.label}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            {tabs.map(tab => (
              <Tab.Pane key={tab.key} eventKey={tab.key}>
                {UnifiedFieldRegistry.render(tab, v => (tab.value = v))}
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}
