import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import type { ReactElement } from 'react';
import type { IField } from '@/features/form-builder/form-core/domain/field/IField';
import type { BaseFieldExtra } from '@/features/form-builder/form-core/domain/extra/BaseFieldExtra';

export function withValidation<T, E extends BaseFieldExtra = BaseFieldExtra>(
  fieldRenderer: (
    field: IField<T, E>,
    onChange: (value: T) => void,
    hasError: boolean,
  ) => ReactElement,
) {
  return (field: IField<T, E>, onChange: (value: T) => void): ReactElement => {
    const [error, setError] = useState<string[] | null>(null);

    useEffect(() => {
      if (field.extra?.error) {
        setError(field.extra.error);
      } else {
        setError(null);
      }
    }, [field.extra?.error]);

    const handleChange = (value: T) => {
      onChange(value);
      field.value = value;
      const validation = field.validate();
      setError(validation.isValid ? null : validation.errors);
    };

    return (
      <Form.Group
        controlId={`form-${field.name}`}
        className={`${field.extra?.ui?.className ?? 'mb-2'}`}
      >
        <Form.Label className="fw-semibold">{field.label}</Form.Label>
        {fieldRenderer(field, handleChange, error != null)}
        {field.extra?.helperText && (
          <Form.Text className="text-muted">{field.extra.helperText}</Form.Text>
        )}
        {error && (
          <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
            {error?.join(', ')}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    );
  };
}

export function withErrors<T, E extends BaseFieldExtra = BaseFieldExtra>(
  fieldRenderer: (
    field: IField<T, E>,
    onChange: (value: T) => void,
    hasError: boolean,
  ) => ReactElement,
) {
  return (field: IField<T, E>, onChange: (value: T) => void): ReactElement => {
    const [error, setError] = useState<string[] | null>(null);

    useEffect(() => {
      if (field.extra?.error) {
        setError(field.extra.error);
      } else {
        setError(null);
      }
    }, [field.extra?.error]);

    const handleChange = (value: T) => {
      onChange(value);
      field.value = value;
      const validation = field.validate();
      setError(validation.isValid ? null : validation.errors);
    };

    return (
      <div
        className={`${field.extra?.ui?.className ?? 'mb-2'}
          `}
      >
        {fieldRenderer(field, handleChange, error != null)}
        {error && (
          <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
            {error.join(', ')}
          </Form.Control.Feedback>
        )}
      </div>
    );
  };
}
