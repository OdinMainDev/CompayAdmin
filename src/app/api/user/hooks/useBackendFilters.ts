import { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useUsers } from './useUsers';
import { RawFormSection } from '@/features/form-builder/form-core/domain/field/RawFormSection';
import { FilterReponse } from '@/features/api-client/types/datatable';


export const useBackendFilters = () => {
  const { t } = useTranslation();
  const { filters: backendFiltersData, fetchFilters } = useUsers();
  const [isLoading, setIsLoading] = useState(false);

  const loadFilters = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchFilters();
    } finally {
      setIsLoading(false);
    }
  }, [fetchFilters]);

  useEffect(() => {
    loadFilters();
  }, [loadFilters]);

  const filters = useMemo<RawFormSection[]>(() => {
    if (!backendFiltersData || backendFiltersData.length === 0) return [];

    const transformType = (type: string) => {
      switch (type.toLowerCase()) {
        case 'integer':
        case 'number':
        case 'float':
        case 'decimal':
        case 'merchant_id':
          return 'number';
        case 'string':
        case 'text':
        case 'varchar':
          return 'text';
        case 'boolean':
        case 'bool':
          return 'select';
        case 'list':
        case 'select':
        case 'dropdown':
        case 'enum':
          return 'select';
        case 'multiselect':
          return 'multiselect';
        case 'date':
        case 'datetime':
        case 'timestamp':
          return 'date-range';
        case 'range':
        case 'slider':
          return 'range';
        default:
          return 'text';
      }
    };

    return [
      {
        title: '',
        fields: backendFiltersData.map((filter: FilterReponse) => {
          const baseField = {
            name: filter.name,
            label: t(filter.name),
            placeholder: t(filter.name),
            type: transformType(filter.type),
          };

          if (filter.type.toLowerCase() === 'bool' || filter.type.toLowerCase() === 'boolean') {
            return {
              ...baseField,
              options: [
                { label: t('yes'), value: true },
                { label: t('no'), value: false },
              ],
            };
          }

          if (
            ['list', 'select', 'dropdown', 'enum', 'multiselect'].includes(filter.type.toLowerCase()) &&
            Array.isArray(filter.values) && filter.values.length > 0
          ) {
            return {
              ...baseField,
              options: filter.values.map(v => ({ label: String(v), value: v })),
            };
          }

          return baseField;
        }),
      },
    ];
  }, [backendFiltersData, t]);

  return { filters, isLoading, reload: loadFilters };
};
