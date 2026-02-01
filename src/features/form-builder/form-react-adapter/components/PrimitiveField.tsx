import { Form, OverlayTrigger, Tooltip, InputGroup } from 'react-bootstrap';
import { ChangeEvent } from 'react';
import type { IField } from '../../form-core/domain/field/IField';
import type { TextFieldExtra } from '../../form-core/domain/extra/TextFieldExtra';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

export function PrimitiveFieldRenderer<T extends string | number | null>(
  field: IField<T, TextFieldExtra>,
  onChange: (value: T) => void,
  hasError: boolean,
) {
  const isTextarea = field.type === 'textarea';
  const isNumber = field.type === 'number';

  const inputElement = isTextarea ? (
    <Form.Control
      as="textarea"
      rows={4}
      placeholder={field.extra?.placeholder ?? field.label}
      required={field.extra?.required}
      value={field.value ?? ''}
      isInvalid={hasError}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value as T)}
    />
  ) : (
    <Form.Control
      type={field.type}
      placeholder={field.extra?.placeholder ?? field.label}
      required={field.extra?.required}
      value={field.value ?? ''}
      isInvalid={hasError}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        if (isNumber) {
          onChange(Number(e.target.value) as T);
        } else {
          onChange(e.target.value as T);
        }
      }}
    />
  );

  if (field.extra?.tooltip) {
    return (
      <InputGroup>
        {inputElement}
        <OverlayTrigger
          placement={field.extra?.tooltip.placement ?? 'top'}
          overlay={<Tooltip id={`tooltip-${field.name}`}>{field.extra.tooltip.text}</Tooltip>}
        >
          <InputGroup.Text
            style={{
              cursor: 'pointer',
              borderLeft: '0',
              borderTopRightRadius: '0.375rem',
              borderBottomRightRadius: '0.375rem',
              borderRight: '1px solid #ced4da',
              backgroundColor: 'white',
            }}
          >
            <FontAwesomeIcon icon={faQuestionCircle} />
          </InputGroup.Text>
        </OverlayTrigger>
      </InputGroup>
    );
  }

  return inputElement;
}
