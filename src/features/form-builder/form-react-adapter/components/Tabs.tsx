import { Nav, Row, Col, Tab } from 'react-bootstrap';
import { type TabFieldValue } from '../../form-core/domain/field/TabField';
import type { TabsFieldExtra } from '../../form-core/domain/extra/TabFieldExtra';
import type { IField } from '../../form-core/domain/field/IField';
import { UnifiedFieldRegistry } from '../UnifiedFieldRegistry';
import React from 'react';

export function TabsRenderer(
  field: IField<TabFieldValue, TabsFieldExtra>,
  onChange: (value: TabFieldValue) => void,
) {
  const tabs = field.extra?.tabs ?? [];

  return (
    <Tab.Container defaultActiveKey={tabs[0]?.name}>
      <Nav variant="tabs">
        {tabs.map((tab) => (
          <Nav.Item key={tab.name}>
            <Nav.Link eventKey={tab.name}>{tab.label}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <Tab.Content className="pt-3">
        {tabs.map((tab) => (
          <Tab.Pane eventKey={tab.name} key={tab.name}>
            <Row className="g-3">
              {tab.elements.map((inner) => {
                const extra = inner.extra;
                const uniqueKey = `${tab.name}_${inner.name}`;

                return (
                  <React.Fragment key={uniqueKey}>
                    {inner.extra?.beforeField}
                    <Col key={uniqueKey} md={extra?.ui?.col ?? 6}>
                      {field.extra?.beforeField}
                      {UnifiedFieldRegistry.renderAny(inner, (value) => {
                        if (field.extra && field.extra.error && field.extra.error.length > 0) {
                          field.extra.error = [];
                        }

                        onChange({
                          ...(field.value ?? {}),
                          [inner.name]: value,
                        });
                      })}
                    </Col>
                  </React.Fragment>
                );
              })}
            </Row>
          </Tab.Pane>
        ))}
      </Tab.Content>
    </Tab.Container>
  );
}
