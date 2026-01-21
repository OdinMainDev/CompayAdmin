import { Form } from 'react-bootstrap';
import type { ChangeEvent } from 'react';
import type { TextFieldExtra } from '../../form-core/domain/extra/TextFieldExtra';
import type { IField } from '../../form-core/domain/field/IField';

export const TextFieldRenderer = (
    field: IField<string, TextFieldExtra>,
    onChange: (value: string) => void
) => {
  const isTextarea = field.type === 'textarea';
  const isPassword = field.type === 'password';

  if (isTextarea) {
    return (
      <Form.Control
        as="textarea"
        rows={4}
        placeholder={field.label}
        required={field.extra?.required}
        value={field.value ?? ''}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
      />
    );
  }

  return (
    <Form.Control
      as="input"
      type={isPassword ? 'password' : 'text'}
      placeholder={field.label}
      required={field.extra?.required}
      value={field.value ?? ''}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value)
      }
    />
  );
};
