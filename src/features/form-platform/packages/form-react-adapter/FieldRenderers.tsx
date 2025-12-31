import { useState } from 'react';
import { Form } from 'react-bootstrap';
import type { ReactElement } from 'react';
import type { IField } from '../form-core/domain/field/IField';
import type { BaseFieldExtra } from '../form-core/domain/extra/BaseFieldExtra';

export function withValidation<T, E extends BaseFieldExtra = BaseFieldExtra>(
    fieldRenderer: (field: IField<T, E>, onChange: (value: T) => void) => ReactElement
  ) {
    return (field: IField<T, E>, onChange: (value: T) => void): ReactElement => {
      const [error, setError] = useState<string[] | null>(null);
  
      const handleChange = (value: T) => {
        onChange(value);
        field.value = value;
        const validation = field.validate();
        setError(validation.isValid ? null : validation.errors);
      };
  
      return (
        <Form.Group controlId={`form-${field.name}`}>
          <Form.Label className="fw-semibold">{field.label}</Form.Label>
          {fieldRenderer(field, handleChange)}
          {field.extra?.helperText && <Form.Text className="text-muted">{field.extra.helperText}</Form.Text>}
          {error && (
            <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                {error?.join(', ')}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      );
    };
  }
  
export const asComponent = <T, E extends BaseFieldExtra>(
  renderFunc: (field: IField<T, E>, onChange: (value: T) => void) => ReactElement
): React.FC<{ field: IField<T, E>; onChange: (value: T) => void }> => {
  return (props) => renderFunc(props.field, props.onChange);
};


  