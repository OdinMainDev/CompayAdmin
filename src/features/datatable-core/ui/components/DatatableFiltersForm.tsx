import { useState } from 'react';
import { buildDefaultValues } from '@/features/form-builder/form-core/domain/utils/default';
import UnifiedFormBuilder from '@/features/form-builder/form-react-adapter/UnifiedFormBuilder';
import type { DatatableEngine } from '@/features/datatable-core/runtime/DatatableEngine';
import type { FilterCondition } from '@/features/datatable-core/domain/value-objects/FilterCondition';
import { FormSection } from '@/features/form-builder/form-core/domain/field/FormSection';
import { useTranslation } from 'react-i18next';

interface DatatableFiltersFormProps<T> {
  engine?: DatatableEngine<T>;
  filterForm?: FormSection[];
  onFilterChange: (filters: FilterCondition[]) => void;
  className?: string;
}

export function DatatableFiltersForm<T>({
  engine,
  filterForm,
  onFilterChange,
  className = '',
}: DatatableFiltersFormProps<T>): React.ReactElement | null {
  const convertFiltersToFormData = (filters: FilterCondition[]): Record<string, unknown> => {
    const formData: Record<string, unknown> = {};

    filters.forEach((filter) => {
      formData[filter.field] = filter.value;
    });

    return formData;
  };

  const buildInitialFormData = (): Record<string, unknown> => {
    const baseDefaults = buildDefaultValues(filterForm || []);
    if (!engine) return baseDefaults;
    const filters = engine.getState().filters ?? [];
    if (filters.length === 0) return baseDefaults;
    return {
      ...baseDefaults,
      ...convertFiltersToFormData(filters),
    };
  };

  const [formData, setFormData] = useState<Record<string, unknown>>(buildInitialFormData);
  const { t } = useTranslation('panel');

  const convertFormToFilters = (data: Record<string, unknown>): FilterCondition[] => {
    const filters: FilterCondition[] = [];

    Object.entries(data).forEach(([field, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        filters.push({
          field,
          value,
        });
      }
    });

    return filters;
  };

  const handleSubmit = () => {
    const filters = convertFormToFilters(formData);
    onFilterChange(filters);
  };

  if (!filterForm || filterForm.length === 0) {
    return null;
  }

  return (
    <div className={`datatable-filters-form ${className}`}>
      <UnifiedFormBuilder
        fields={filterForm}
        formData={formData}
        resetAble={true}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        submitLabel={t('datatable.filters_submit')}
      />
    </div>
  );
}
