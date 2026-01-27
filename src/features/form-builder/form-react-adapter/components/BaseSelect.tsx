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
    borderColor: state.isFocused ? 'unset' : 'rgba(248, 189, 122, 0.25)',
    boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(97, 218, 251, 0.25)' : 'none',
    '&:hover': { borderColor: 'rgba(248, 189, 122, 1)' },
  }),
  singleValue: (provided) => ({ ...provided, color: '#212529' }),
  multiValue: (provided) => ({ ...provided, borderRadius: '.5rem', backgroundColor: 'rgba(248, 189, 122, 1)', color: '#000' }),
  multiValueLabel: (provided) => ({ ...provided, color: '#000' }),
  multiValueRemove: (provided) => ({
    ...provided,
    borderRadius: '.5rem',
    color: '#000',
    ':hover': { backgroundColor: 'rgba(248, 189, 122, 0.75)', color: '#000' },
  }),
  placeholder: (provided) => ({ ...provided, color: '#6c757d' }),
  menu: (provided) => ({ ...provided, borderRadius: '.5rem', boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)' }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'rgba(248, 189, 122, 1)' : state.isFocused ? '#f8f9fa' : '#fff',
    color: state.isSelected ? '#000' : '#212529',
    ':active': { backgroundColor: 'rgba(248, 189, 122, 1)', color: '#000' },
  }),
};

export interface BaseSingleSelectRendererProps<T extends string | number> {
  field: IField<T, SelectFieldExtra>;
  onChange: (value: T) => void;
  hasError: boolean,
  placeholder?: string;
  noOptionsMessage?: string;
  styles?: StylesConfig<ReactSelectOption, false>;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

export interface BaseMultiSelectRendererProps<T extends string | number> {
  field: IField<T[], SelectFieldExtra>;
  onChange: (value: T[]) => void;
  hasError: boolean
  placeholder?: string;
  noOptionsMessage?: string;
  styles?: StylesConfig<ReactSelectOption, true>;
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
    hasError,
    isMulti,
    placeholder = 'Выберите опцию...',
    noOptionsMessage = 'Нет доступных опций',
    onMenuOpen = () => {},
    onMenuClose = () => {},
  } = props;

  const onInputChange = useMemo(
    () => field.extra?.onInputChange ?? (() => {}),
    [field.extra?.onInputChange]
  );

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
    if (isMulti) {
      const values = (newValue as MultiValue<ReactSelectOption>).map((o) =>
        Array.isArray(field.value) && field.type === 'multiselect-number' ? Number(o.originalValue) : o.originalValue
      );
      onChange(values as T[]);
    } else {
      const option = newValue as SingleValue<ReactSelectOption>;
      if (!option)  return onChange(undefined as unknown as T); 
      const value =  field.type === 'select-number' ? Number(option.originalValue) : option.originalValue;
      onChange(value as T);
    }
  };

  const selectStyles = useMemo<StylesConfig<ReactSelectOption, boolean>>(
  () => ({
    ...defaultStyles,

    control: (provided, state) => {
      const isError = hasError;

      return {
        ...provided,
        borderRadius: '.5rem',
        borderColor: isError
          ? '#dc3545'
          : state.isFocused
            ? ''
            : '#dee2e6',
        boxShadow: isError
          ? '0 0 0 0.25rem rgba(220, 53, 69, 0.25)'
          : state.isFocused
            ? 'inset 0 1px 2px rgba(46, 54, 80, 0.075), 0 0 0 0.2rem rgba(38, 43, 64, 0.25)'
            : 'none',
        '&:hover': {
          borderColor: isError ? '#dc3545' : '',
        },
      };
    },
  }),
  [hasError]
);

  return (
    <Select
      ref={ref} 
      options={selectOptions}
      value={selectedValue}
      onChange={handleChange}
      styles={selectStyles}
      isClearable={true}
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
      })}
    />
  );
}

export const BaseSelectRenderer = forwardRef(BaseSelectRendererInner) as <T extends string | number>(
  props: BaseSelectRendererProps<T> & {
    ref?: React.Ref<SelectInstance<ReactSelectOption, boolean, GroupBase<ReactSelectOption>>>;
  }
) => React.ReactElement;