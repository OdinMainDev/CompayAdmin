import { useEffect, useRef, useState } from 'react';
import { SelectField } from '@/features/form-builder/form-core/domain/field/SelectField';
import { IField } from '@/features/form-builder/form-core/domain/field/IField';
import { DynamicFilterCache } from '@/features/form-builder/form-core/domain/utils/DynamicFilterCacheService';
import { UnifiedFieldRegistry } from '@/features/form-builder/form-react-adapter/UnifiedFieldRegistry';
import { BaseFieldExtra } from '@/features/form-builder/form-core/domain/extra/BaseFieldExtra';
import { SelectOption } from '@/features/form-builder/form-core/domain/extra/SelectFieldExtra';

export function AsyncSelect<T>({
  field,
  cacheKey,
  fetcher,
  mapOption,
  onChange,
}: {
  field: IField<number | null | string, BaseFieldExtra>;
  cacheKey: string;
  fetcher: (query: string) => Promise<T[]>;
  mapOption: (item: T) => SelectOption;
  onChange: (value: string | number | null) => void;
}) {
  const [,setTick] = useState(0);

  const [selectField, setSelectField] = useState(() =>
    SelectField.create(field.name, field.label, field.extra, field.value?.toString() ?? ''),
  );
  useEffect(() => {
    if (!selectField) return;
    if (!selectField.extra) selectField.extra = {}; 
    selectField.extra.error = field.extra?.error; 
    setTick((prev) => prev + 1);
  }, [field.extra?.error]);
  

  const inputRef = useRef('');
  const debounceRef = useRef<number | undefined>(undefined);
  const load = (query: string) => {
    DynamicFilterCache.get(`${cacheKey}:${query}`, () => fetcher(query)).then((data) => {
      setSelectField((prev) =>
        SelectField.create(
          prev.name,
          prev.label,
          {
            ...(prev.extra ?? {}),
            options: data.map(mapOption),
            onInputChange,
          },
          prev.value ?? '',
        ),
      );
    });
  };

  const onInputChange = (value: string, actionMeta: { action: string }) => {
    if (actionMeta.action !== 'input-change') return;
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

    setSelectField((prev) => {
      if (prev.value === nextValue) {
        return prev;
      }

      return SelectField.create(prev.name, prev.label, prev.extra ?? { options: [] }, nextValue);
    });
  }, [field.value]);

  useEffect(() => {
    const nextValue = field.value?.toString() ?? '';
    if (nextValue) {
      DynamicFilterCache.get(`${cacheKey}:value:${nextValue}`, async () => ['']).then(
        ([lastQuery]) => {
          load(lastQuery);
        },
      );
    }
  }, [field.value]);

  const onChangeHandler = (v: unknown) => {
    onChange(v as string | number | null);

    if (v) {
      DynamicFilterCache.get(`${cacheKey}:value:${v}`, async () => [inputRef.current]);
    }
  };

  return UnifiedFieldRegistry.renderAny(selectField, (v) => onChangeHandler(v));
}
