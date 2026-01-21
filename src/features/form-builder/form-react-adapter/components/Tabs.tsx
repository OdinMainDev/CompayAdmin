import { Nav, Row, Col, Tab } from 'react-bootstrap';
import { type TabFieldValue } from '../../form-core/domain/field/TabField';
import type { TabsFieldExtra } from '../../form-core/domain/extra/TabFieldExtra';
import type { IField } from '../../form-core/domain/field/IField';
import { UnifiedFieldRegistry } from '../UnifiedFieldRegistry';

export function TabsRenderer(
  field: IField<TabFieldValue, TabsFieldExtra>,
  onChange: (value: TabFieldValue) => void
) {
  const tabs = field.extra?.tabs ?? [];

  return (
    <Tab.Container defaultActiveKey={tabs[0]?.name}>
      <Nav variant="tabs">
        {tabs.map(tab => (
          <Nav.Item key={tab.name}>
            <Nav.Link eventKey={tab.name}>{tab.label}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <Tab.Content className="pt-3">
        {tabs.map(tab => (
          <Tab.Pane eventKey={tab.name} key={tab.name}>
            <Row className="g-3">
              {tab.elements.map(inner => (
                <Col key={inner.name} md={inner.extra?.col ?? 6}>
                  {UnifiedFieldRegistry.render(inner, value => {
                    onChange({
                      ...(field.value ?? {}),
                      [inner.name]: value,
                    });
                  })}
                </Col>
              ))}
            </Row>
          </Tab.Pane>
        ))}
      </Tab.Content>
    </Tab.Container>
  );
}
