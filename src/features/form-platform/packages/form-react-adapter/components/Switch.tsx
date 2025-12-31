import { Form } from 'react-bootstrap';
import type { IField } from '../../form-core/domain/field/IField';
import type { BaseFieldExtra } from '../../form-core/domain/extra/BaseFieldExtra';

export const SwitchRenderer = (
  field: IField<boolean, BaseFieldExtra>,
  onChange: (value: boolean) => void
) => {
  return (
    <div className="mt-3">
      <Form.Check
        type="switch"
        id={`switch-${field.name}`}
        label={field.label}
        checked={!!field.value}
        onChange={(e) => onChange(e.target.checked)}
        disabled={field.extra?.disabled} 
      />
    </div>
  );
};
