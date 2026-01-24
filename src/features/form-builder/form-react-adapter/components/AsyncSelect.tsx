import { useEffect, useState } from 'react';
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
  fetcher: () => Promise<T[]>;
  mapOption: (item: T) => { label: string; value: string };
  onChange: (value: number | null) => void;
}) {

  const [selectField, setSelectField] = useState(() =>
    SelectField.fromJson({ key: field.name, label: field.label, defaultValue: field.value?.toString() ?? '', options: { options: [] } })
  );

  useEffect(() => {
    let canceled = false;
    DynamicFilterCache.get(cacheKey, fetcher).then((data) => {
      if (canceled) return;
      setSelectField((prev) =>
        SelectField.fromJson({
          key: prev.name, 
          label: prev.label,
          defaultValue: prev.value ?? '',
          options: { ...(prev.extra ?? {}), options: data.map(mapOption)},
        })
      );
      
    });
    return () => { canceled = true; };
  }, [cacheKey, fetcher, mapOption]);
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
  
  return UnifiedFieldRegistry.render(selectField, (v) => onChange(v ? Number(v) : null));
}
