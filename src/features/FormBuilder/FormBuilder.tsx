import { type FormEvent, useState, type ReactNode } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import FormFieldRenderer from './components/FormFieldRenderer';
import { type FormSection } from './entities';

type FieldErrors = Record<string, string | string[]>;

interface FormBuilderProps<T extends Record<string, any>> {
  sections: FormSection[];
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  formData: T;
  handleSubmit: () => void;
  title?: string;
  subTitle?: string;
  submitLabel?: ReactNode;
  saving?: boolean;
  fieldErrors?: FieldErrors;
  alertMessage?: string | null;
}

const FormBuilder = <T extends Record<string, any>>({
  sections,
  setFormData,
  formData,
  handleSubmit,
  title,
  subTitle,
  submitLabel = 'Сохранить',
  saving,
  fieldErrors,
  alertMessage,
}: FormBuilderProps<T>) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    handleSubmit();
  };

  return (
    <Form onSubmit={onSubmit}>
      {title && <h2 className="h4 mb-1 text-dark">{title}</h2>}
      {subTitle && <p className="text-muted mb-4">{subTitle}</p>}

      <Card className="shadow-sm border-0">
        <Card.Body>
          {sections.map((section, index) => (
            <div key={`${section.title}-${index}`} className="mb-4">
              {section.title && <h5 className="mb-1">{section.title}</h5>}
              {section.description && <div className="text-muted mb-3">{section.description}</div>}
              <Row className="g-3">
                {section.fields.map((field) => (
                  <Col xs={12} md={field.col ?? 6} key={field.name}>
                    <FormFieldRenderer
                      field={field}
                      value={formData[field.name]}
                      error={fieldErrors?.[field.name]}
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
        </Card.Body>
      </Card>
      <div className="d-flex justify-content-end mt-3">
        <Button type="submit" disabled={saving} variant="primary">
          {isSubmitted && !saving ? 'Сохранено' : submitLabel}
        </Button>
      </div>
    </Form>
  );
};

export default FormBuilder;
