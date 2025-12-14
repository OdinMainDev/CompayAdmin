import { ChangeEvent } from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FormField } from '../entities';
import ImageUpload from './ImageUpload';

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (name: string, value: any) => void;
  error?: string | string[];
}

const FormFieldRenderer = ({ field, value, onChange, error }: FormFieldRendererProps) => {
  const { t } = useTranslation();

  const commonProps = {
    id: `form-${field.name}`,
    placeholder: field.placeholder ?? field.label,
    required: field.required,
    value: value ?? '',
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(field.name, event.target.value),
  };

  if (field.type === 'textarea') {
    return (
      <Form.Group controlId={`form-${field.name}`}>
        <Form.Label className="fw-semibold">{field.label}</Form.Label>
        <Form.Control as="textarea" rows={4} {...commonProps} />
        {error && <div className="text-danger small mt-1">{Array.isArray(error) ? error.join(', ') : error}</div>}
        {field.helperText && <Form.Text className="text-muted">{field.helperText}</Form.Text>}
      </Form.Group>
    );
  }

  if (field.type === 'select') {
    return (
      <Form.Group controlId={`form-${field.name}`}>
        <Form.Label className="fw-semibold">{field.label}</Form.Label>
        <Form.Select
          value={value ?? ''}
          required={field.required}
          onChange={(event) => onChange(field.name, event.target.value)}
        >
          <option value="">{t('form.select_placeholder')}</option>
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
        {error && <div className="text-danger small mt-1">{Array.isArray(error) ? error.join(', ') : error}</div>}
        {field.helperText && <Form.Text className="text-muted">{field.helperText}</Form.Text>}
      </Form.Group>
    );
  }

  if (field.type === 'multiselect') {
    const selected: string[] = Array.isArray(value) ? value.map(String) : [];
    return (
      <Form.Group controlId={`form-${field.name}`}>
        <Form.Label className="fw-semibold">{field.label}</Form.Label>
        <Form.Select
          multiple
          required={field.required}
          value={selected}
          onChange={(event) => {
            const values = Array.from(event.target.selectedOptions).map((opt) => opt.value);
            onChange(field.name, values);
          }}
        >
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
        {error && <div className="text-danger small mt-1">{Array.isArray(error) ? error.join(', ') : error}</div>}
        {field.helperText && <Form.Text className="text-muted">{field.helperText}</Form.Text>}
      </Form.Group>
    );
  }

  if (field.type === 'image') {
    return (
      <Form.Group controlId={`form-${field.name}`}>
        <ImageUpload
          label={field.label}
          value={value}
          onChange={(file) => onChange(field.name, file)}
          helperText={field.helperText}
          required={field.required}
        />
        {error && <div className="text-danger small mt-1">{Array.isArray(error) ? error.join(', ') : error}</div>}
      </Form.Group>
    );
  }

  return (
    <Form.Group controlId={`form-${field.name}`}>
      <Form.Label className="fw-semibold">{field.label}</Form.Label>
      <Form.Control
        type={field.type === 'password' ? 'password' : field.type === 'number' ? 'number' : 'text'}
        {...commonProps}
        isInvalid={Boolean(error)}
      />
      {error && (
        <Form.Control.Feedback type="invalid">
          {Array.isArray(error) ? error.join(', ') : error}
        </Form.Control.Feedback>
      )}
      {field.helperText && <Form.Text className="text-muted">{field.helperText}</Form.Text>}
    </Form.Group>
  );
};

export default FormFieldRenderer;
