import { Form } from 'react-bootstrap';
import type { SelectFieldExtra, SelectOption } from '../../form-core/domain/extra/SelectFieldExtra';
import type { IField } from '../../form-core/domain/field/IField';


export const MultiSelectRenderer = <T extends string | number>(
    field: IField<T[], SelectFieldExtra>,
    onChange: (value: T[]) => void
  ) => {
    const selected: (string | number)[] = Array.isArray(field.value) ? field.value : [];
  
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const values: T[] = Array.from(event.target.selectedOptions).map(opt => {
        if (field.type === 'multiselect-number') return Number(opt.value) as T;
        return opt.value as T;
      });
      onChange(values);
    };
  
    const valueForSelect: readonly string[] = selected.map(v => String(v));
  
    return (
      <Form.Select multiple required={field.extra?.required} value={valueForSelect} onChange={handleChange}>
        {field.extra?.options?.map((option: SelectOption) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
    );
  };
  