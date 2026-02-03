import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [options, setOptions] = useState<SelectOption[]>(() => {
    const extraWithOptions = field.extra as BaseFieldExtra & {
      options?: SelectOption[];
    };
    return extraWithOptions?.options ?? [];
  });

  const [lastQuery, setLastQuery] = useState('');
  const [debounceId, setDebounceId] = useState<number | null>(null);
  const load = useCallback(
    async (query: string) => {
      const data = await DynamicFilterCache.get(`${cacheKey}:${query}`, () => fetcher(query));
      setOptions(data.map(mapOption));
    },
    [cacheKey, fetcher, mapOption],
  );

  const onInputChange = useCallback(
    (value: string, actionMeta: { action: string }) => {
      if (actionMeta.action !== 'input-change') return;
      setLastQuery(value);
      if (debounceId !== null) {
        window.clearTimeout(debounceId);
      }
      const nextId = window.setTimeout(() => {
        void load(value);
      }, 300);
      setDebounceId(nextId);
    },
    [debounceId, load],
  );

  useEffect(() => {
    return () => {
      if (debounceId !== null) {
        window.clearTimeout(debounceId);
      }
    };
  }, [debounceId]);

  const onChangeHandler = (value: string | number | null) => {
    onChange(value);

    if (value !== null && value !== '') {
      void DynamicFilterCache.get(`${cacheKey}:value:${value}`, () => [lastQuery]);
    }
  };

  const renderField = useMemo(
    () =>
      SelectField.create(
        field.name,
        field.label,
        {
          ...(field.extra ?? {}),
          options,
          onInputChange,
          error: field.extra?.error,
        },
        field.value?.toString() ?? '',
      ),
    [field.extra, field.label, field.name, field.value, onInputChange, options],
  );

  return UnifiedFieldRegistry.renderAny(renderField, (value) =>
    onChangeHandler(value as string | number | null),
  );
}
