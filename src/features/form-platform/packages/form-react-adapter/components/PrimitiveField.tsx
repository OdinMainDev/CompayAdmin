import { Form } from 'react-bootstrap';
import type { ChangeEvent } from 'react';
import type { IField } from '../../form-core/domain/field/IField';
import type { BaseFieldExtra } from '../../form-core/domain/extra/BaseFieldExtra';

export function PrimitiveFieldRenderer<T extends string | number>(
    field: IField<T, BaseFieldExtra>,
    onChange: (value: T) => void
  ) {
  const isTextarea = field.type === 'textarea';
  const isNumber = field.type === 'number';

  if (isTextarea) {
    return (
      <Form.Control
        as="textarea"
        rows={4}
        placeholder={field.label}
        required={field.extra?.required}
        value={field.value ?? ''}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value as T)
        }
      />
    );
  }

  return (
    <Form.Control
      as="input"
      type={field.type}
      placeholder={field.label}
      required={field.extra?.required}
      value={field.value ?? ''}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        if (isNumber) {
          onChange(Number(e.target.value) as T);
        } else {
          onChange(e.target.value as T);
        }
      }}
    />
  );
}
