import { useEffect, useRef, useState } from 'react';
import { SelectField } from '@/features/form-builder/form-core/domain/field/SelectField';
import { IField } from '@/features/form-builder/form-core/domain/field/IField';
import { DynamicFilterCache } from '../../form-core/domain/utils/DynamicFilterCacheService';
import { UnifiedFieldRegistry } from '../UnifiedFieldRegistry';
import { BaseFieldExtra } from '../../form-core/domain/extra/BaseFieldExtra';

export function AsyncSelect<T>({
  field,
  cacheKey,
  fetcher,
  mapOption,
  onChange,
}: {
  field: IField<number | null, BaseFieldExtra>;
  cacheKey: string;
  fetcher: (query: string) => Promise<T[]>;
  mapOption: (item: T) => { label: string; value: string };
  onChange: (value: number | null) => void;
}) {
  const [selectField, setSelectField] = useState(() =>
    SelectField.fromJson({
      key: field.name,
      label: field.label,
      defaultValue: field.value?.toString() ?? '',
      options: { options: [] },
    })
  );

  const inputRef = useRef('');
  const debounceRef = useRef<number | undefined>(undefined);


  const load = (query: string) => {
    DynamicFilterCache.get(`${cacheKey}:${query}`, () => fetcher(query))
      .then((data) => {
        console.log(data);
        setSelectField((prev) =>
          SelectField.fromJson({
            key: prev.name,
            label: prev.label,
            defaultValue: prev.value ?? '',
            options: {
              ...(prev.extra ?? {}),
              options: data.map(mapOption),
              onInputChange
            },
          })
        );
      });
  };

  const onInputChange = (value: string) => {
    inputRef.current = value;
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      load(value);
    }, 300);
  };

  useEffect(() => {
    load('');
  }, []);

  useEffect(() => {
    const nextValue = field.value?.toString() ?? '';
    setSelectField((prev) =>
      prev.value === nextValue
        ? prev
        : SelectField.fromJson({
            key: prev.name,
            label: prev.label,
            defaultValue: nextValue,
            options: prev.extra ?? { options: [] },
          })
    );
  }, [field.value]);

  return UnifiedFieldRegistry.render(selectField, (v: string) =>
    onChange(v ? Number(v) : null),
  );
}