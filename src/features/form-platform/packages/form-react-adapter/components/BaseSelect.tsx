import React, { useMemo, forwardRef } from 'react';
import Select, {
  type ActionMeta,
  type MultiValue,
  type SingleValue,
  type StylesConfig,
  type GroupBase,
  type SelectInstance,
} from 'react-select';
import type { IField } from '../../form-core/domain/field/IField';
import type { SelectFieldExtra, SelectOption } from '../../form-core/domain/extra/SelectFieldExtra';

export interface ReactSelectOption {
  value: string;
  label: string;
  originalValue: string | number;
}

export const defaultStyles: StylesConfig<ReactSelectOption, boolean> = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: '.5rem',
    borderColor: state.isFocused ? '#61DAFB' : '#dee2e6',
    boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(97, 218, 251, 0.25)' : 'none',
    '&:hover': { borderColor: '#61DAFB' },
  }),
  singleValue: (provided) => ({ ...provided, color: '#212529' }),
  multiValue: (provided) => ({ ...provided, borderRadius: '.5rem', backgroundColor: '#61DAFB', color: '#fff' }),
  multiValueLabel: (provided) => ({ ...provided, color: '#fff' }),
  multiValueRemove: (provided) => ({
    ...provided,
    borderRadius: '.5rem',
    color: '#fff',
    ':hover': { backgroundColor: '#4a9ec9', color: '#fff' },
  }),
  placeholder: (provided) => ({ ...provided, color: '#6c757d' }),
  menu: (provided) => ({ ...provided, borderRadius: '.5rem', boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)' }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#61DAFB' : state.isFocused ? '#f8f9fa' : 'white',
    color: state.isSelected ? 'white' : '#212529',
    ':active': { backgroundColor: '#61DAFB', color: 'white' },
  }),
};

export interface BaseSingleSelectRendererProps<T extends string | number> {
  field: IField<T, SelectFieldExtra>;
  onChange: (value: T) => void;
  placeholder?: string;
  noOptionsMessage?: string;
  styles?: StylesConfig<ReactSelectOption, false>;
  onInputChange?: (value: string) => void;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

export interface BaseMultiSelectRendererProps<T extends string | number> {
  field: IField<T[], SelectFieldExtra>;
  onChange: (value: T[]) => void;
  placeholder?: string;
  noOptionsMessage?: string;
  styles?: StylesConfig<ReactSelectOption, true>;
  onInputChange?: (value: string) => void;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

type BaseSelectRendererProps<T extends string | number> =
  | ({ isMulti: true } & BaseMultiSelectRendererProps<T>)
  | ({ isMulti: false } & BaseSingleSelectRendererProps<T>);

function BaseSelectRendererInner<T extends string | number>(
  props: BaseSelectRendererProps<T>,
  ref: React.Ref<SelectInstance<ReactSelectOption, boolean, GroupBase<ReactSelectOption>>>
) {
  const {
    field,
    onChange,
    isMulti,
    placeholder = 'Выберите опцию...',
    noOptionsMessage = 'Нет доступных опций',
    styles = defaultStyles,
    onInputChange = () => {},
    onMenuOpen = () => {},
    onMenuClose = () => {},
  } = props;

  const selectOptions = useMemo(
    () =>
      (field.extra?.options || []).map((option: SelectOption) => ({
        value: String(option.value),
        label: option.label,
        originalValue: option.value,
      })),
    [field.extra?.options]
  );

  const selectedValue = useMemo(() => {
    if (isMulti) {
      const values = Array.isArray(field.value) ? field.value : [];
      return selectOptions.filter((o) =>
        values.some(v => String(v) === String(o.originalValue))
      );
    } else {
      return selectOptions.find(o => String(o.originalValue) === String(field.value)) || null;
    }
  }, [field.value, selectOptions, isMulti]);
  

  const handleChange = (
    newValue: SingleValue<ReactSelectOption> | MultiValue<ReactSelectOption>,
    _actionMeta: ActionMeta<ReactSelectOption>
  ) => {
    debugger;
    if (isMulti) {
      const values = (newValue as MultiValue<ReactSelectOption>).map((o) =>
        Array.isArray(field.value) && field.type === 'multiselect-number' ? Number(o.originalValue) : o.originalValue
      );
      onChange(values as T[]);
    } else {
      const option = newValue as SingleValue<ReactSelectOption>;
      if (!option) return onChange('' as T);
      const value =  field.type === 'select-number' ? Number(option.originalValue) : option.originalValue;
      onChange(value as T);
    }
  };

  return (
    <Select
      ref={ref} 
      options={selectOptions}
      value={selectedValue}
      onChange={handleChange}
      styles={styles as any}
      isMulti={isMulti}
      isSearchable
      placeholder={placeholder}
      noOptionsMessage={() => noOptionsMessage}
      closeMenuOnSelect={!isMulti}
      hideSelectedOptions={false}
      onInputChange={onInputChange}
      onMenuOpen={onMenuOpen}
      onMenuClose={onMenuClose}
      theme={(theme) => ({
        ...theme,
        borderRadius: 0,
        colors: {
          ...theme.colors,
          primary25: '#f0f8ff',
          primary50: '#e1f5fe',
          primary75: '#b3e5fc',
          primary: '#61DAFB',
        },
      })}
    />
  );
}

export const BaseSelectRenderer = forwardRef(BaseSelectRendererInner) as <T extends string | number>(
  props: BaseSelectRendererProps<T> & {
    ref?: React.Ref<SelectInstance<ReactSelectOption, boolean, GroupBase<ReactSelectOption>>>;
  }
) => React.ReactElement;