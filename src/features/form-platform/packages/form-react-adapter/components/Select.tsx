import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import type { IField } from '../../form-core/domain/field/IField';
import type { SelectFieldExtra } from '../../form-core/domain/extra/SelectFieldExtra';

export const SelectRenderer = <T extends string | number>(
  field: IField<T, SelectFieldExtra>,
  onChange: (value: T) => void
) => {
  const { t } = useTranslation();

  return (
    <Form.Select
      value={field.value ?? (typeof field.value === 'string' ? '' : 0)}
      required={field.extra?.required}
      onChange={(e) => {
        var val = e.target.value as string | number;
        if (field.type === 'select-number') {
          val = Number(val);
        }
        onChange(val as T);
      }}
    >
      <option value="">{t('form.select_placeholder')}</option>
      {field.extra?.options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Form.Select>
  );
};