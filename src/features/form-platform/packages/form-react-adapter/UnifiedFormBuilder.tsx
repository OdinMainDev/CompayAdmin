import { type FormEvent, useState, type ReactNode, useMemo } from 'react';
import { Button, Card, Form, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { JsonFormLoader } from './JsonFormLoader';
import type { FormSection } from '../form-core/domain/field/FormSection';
import './setupFields';
import { UnifiedFieldRegistry } from './UnifiedFieldRegistry';
import type { RawFormSection } from '../form-core/domain/field/RawFormSection';

type FieldErrors = Record<string, string[]>;

interface FormBuilderProps<T extends Record<string, unknown>> {
  json: RawFormSection[];
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  formData: T;
  handleSubmit: () => void | Promise<void>;
  title?: string;
  subTitle?: string;
  submitLabel?: ReactNode;
  saving?: boolean;
  fieldErrors?: FieldErrors ;
}


const UnifiedFormBuilder = <T extends Record<string, unknown>>({
  json,
  setFormData,
  formData,
  handleSubmit,
  title,
  subTitle,
  submitLabel,
  saving,
  fieldErrors
}: FormBuilderProps<T>) => {

  const errors = fieldErrors ?? {}; 

  const sectionsWithErrors = useMemo(() => {
    return json.map((section) => ({
      ...section,
      fields: section.fields.map((field) => ({
        ...field,
        error: errors[field.name as string],
      })),
    }));
  }, [json, errors]);
  
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const sections: FormSection[] = JsonFormLoader.loadForm(sectionsWithErrors, formData);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await Promise.resolve(handleSubmit());
    } finally {
      setSubmitting(false);
    }
  };

  const isSaving = saving ?? submitting;
  const resolvedSubmitLabel = submitLabel ?? t('submit');

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
              {section.fields.map((field) =>
              
                UnifiedFieldRegistry.render(field, (value) => {
                  setFormData((prev) => ({
                    ...prev,
                    [field.name]: value,
                  }));
                })
              )}
            </div>
          ))}
        </Card.Body>

      </Card>
      <div className="d-flex justify-content-end mt-3">
        <Button type="submit" disabled={isSaving} variant="primary">
          {isSaving ? (
            <>
              <Spinner animation="border" size="sm" role="status" className="me-2">
                <span className="visually-hidden">{t('form.loading')}</span>
              </Spinner>
              {resolvedSubmitLabel}
            </>
          ) : (
            resolvedSubmitLabel
          )}
        </Button>
      </div>
    </Form>
  );
};

export default UnifiedFormBuilder ;
