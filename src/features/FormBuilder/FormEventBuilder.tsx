import { FormEvent, useState } from 'react';
import { Button, Card, Col, Form, Nav, Row, Tab } from 'react-bootstrap';
import FormFieldRenderer from './components/FormFieldRenderer';
import { FormSection } from './entities';

interface EventTab {
  key: string;
  title: string;
  sections: FormSection[];
}

interface FormEventBuilderProps {
  tabs: EventTab[];
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  formData: Record<string, any>;
  handleSubmit: () => void;
  submitLabel?: string;
}

const FormEventBuilder = ({
  tabs,
  setFormData,
  formData,
  handleSubmit,
  submitLabel = 'Сохранить',
}: FormEventBuilderProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const firstKey = tabs[0]?.key ?? 'main';

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    handleSubmit();
  };

  return (
    <Form onSubmit={onSubmit}>
      <Card className="shadow-sm border-0">
        <Card.Body>
          <Tab.Container defaultActiveKey={firstKey}>
            <Nav variant="underline" className="mb-3">
              {tabs.map((tab) => (
                <Nav.Item key={tab.key}>
                  <Nav.Link eventKey={tab.key}>{tab.title}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
            <Tab.Content>
              {tabs.map((tab) => (
                <Tab.Pane eventKey={tab.key} key={tab.key}>
                  {tab.sections.map((section, idx) => (
                    <div key={`${tab.key}-${idx}`} className="mb-4">
                      {section.title && <h5 className="mb-1">{section.title}</h5>}
                      {section.description && (
                        <div className="text-muted mb-3">{section.description}</div>
                      )}
                      <Row className="g-3">
                        {section.fields.map((field) => (
                          <Col xs={12} md={field.col ?? 6} key={field.name}>
                            <FormFieldRenderer
                              field={field}
                              value={formData[field.name]}
                              onChange={(name, value) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  [name]: value,
                                }))
                              }
                            />
                          </Col>
                        ))}
                      </Row>
                    </div>
                  ))}
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>
      <div className="d-flex justify-content-end mt-3">
        <Button type="submit" variant="primary">
          {isSubmitted ? 'Сохранено' : submitLabel}
        </Button>
      </div>
    </Form>
  );
};

export default FormEventBuilder;
