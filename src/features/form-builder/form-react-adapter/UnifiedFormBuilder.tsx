import { type FormEvent, useState, type ReactNode } from 'react';
import { Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import type { FormSection } from '@/features/form-builder/form-core/domain/field/FormSection';
import './setupFields';
import { UnifiedFieldRegistry } from './UnifiedFieldRegistry';
import { FormHydrator } from './Hydrator';
import PageHeader from '@/components/dashboard/common/PageHeader';
import React from 'react';

interface FormBuilderProps<T> {
  fields: FormSection[];
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  formData: T;
  handleSubmit: () => void | Promise<void>;
  title?: string;
  subTitle?: string;
  submitLabel?: ReactNode;
  saving?: boolean;
  resetAble?: boolean;
  fieldErrors?: Record<string, string[]>;

  topSlot?: React.ReactNode;
  leftSlot?: React.ReactNode;
}

const UnifiedFormBuilder = <T,>({
  fields: json,
  setFormData,
  formData,
  handleSubmit,
  title,
  subTitle,
  submitLabel,
  saving,
  resetAble = false,
  fieldErrors,

  topSlot,
  leftSlot,
}: FormBuilderProps<T>) => {
  const { t } = useTranslation('panel');
  const [submitting, setSubmitting] = useState(false);
  const sections: FormSection[] = FormHydrator.hydrate(json, formData, fieldErrors);

  const handleReset = () => {
    const defaultValues: Record<string, unknown> = {};
    const emptySection: FormSection[] = FormHydrator.hydrate(json, {}, {});

    emptySection.forEach((section) => {
      section.fields.forEach((field) => {
        defaultValues[field.name] = '';
      });
    });

    setFormData(defaultValues as T);
  };

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
    <>
      {(title || subTitle) && <PageHeader title={title ?? ''} subtitle={subTitle ?? ''} />}

      {topSlot && <div className="mb-3">{topSlot}</div>}

      <Form onSubmit={onSubmit}>
        <Row>
          {leftSlot && (
            <Col xs={12} md={3}>
              {leftSlot}
            </Col>
          )}

          <Col xs={12} md={leftSlot ? 9 : 12}>
            <Card className="border-0">
              <Card.Body>
                {sections.map((section, index) => (
                  <div key={`${section.title}-${index}`} className="mb-4">
                    {section.title && (
                      <h5 className={section.description ? 'mb-1' : 'mb-3'}>{section.title}</h5>
                    )}
                    {section.description && (
                      <div className="text-muted mb-3">{section.description}</div>
                    )}

                    <Row>
                      {section.fields.map((field) => (
                        <React.Fragment key={field.name}>
                          {field.extra?.beforeField}
                          <Col md={field.extra?.ui?.col ?? 12}>
                            {UnifiedFieldRegistry.renderAny(field, (value) => {
                              setFormData((prev) => {
                                if (
                                  'isComposite' in field &&
                                  field.isComposite &&
                                  typeof value === 'object' &&
                                  value !== null
                                ) {
                                  return { ...prev, ...value };
                                }
                                return { ...prev, [field.name]: value };
                              });
                            })}
                          </Col>
                        </React.Fragment>
                      ))}
                    </Row>
                  </div>
                ))}
              </Card.Body>
            </Card>
            <div className="d-flex justify-content-end mt-3 mb-3">
              {resetAble && (
                <Button
                  type="button"
                  variant="warning"
                  className="me-2"
                  onClick={handleReset}
                  disabled={isSaving}
                >
                  {t('datatable.filters_reset')}
                </Button>
              )}

              <Button type="submit" disabled={isSaving} variant="primary">
                {isSaving ? (
                  <>
                    <Spinner animation="border" size="sm" role="status" className="me-2" />
                    {resolvedSubmitLabel}
                  </>
                ) : (
                  resolvedSubmitLabel
                )}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default UnifiedFormBuilder;
