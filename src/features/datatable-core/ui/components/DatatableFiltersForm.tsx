import { useState, useEffect } from "react";
import { buildDefaultValues } from "@/features/form-builder/form-core/domain/utils/default";
import UnifiedFormBuilder from "@/features/form-builder/form-react-adapter/UnifiedFormBuilder";
import type { DatatableEngine } from "@/features/datatable-core/runtime/DatatableEngine";
import type { FilterCondition } from "@/features/datatable-core/domain/value-objects/FilterCondition";
import { FormSection } from "@/features/form-builder/form-core/domain/field/FormSection";
import { useTranslation } from "react-i18next";

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
  className = ''
}: DatatableFiltersFormProps<T>): React.ReactElement | null {
  const [formData, setFormData] = useState<Record<string, unknown>>(() => 
    filterForm ? buildDefaultValues(filterForm) : {}
  );
  const { t } = useTranslation("panel")

  const convertFormToFilters = (data: Record<string, unknown>): FilterCondition[] => {
    const filters: FilterCondition[] = [];
    
    Object.entries(data).forEach(([field, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        filters.push({
          field,
          value
        });
      }
    });
    
    return filters;
  };

  const convertFiltersToFormData = (filters: FilterCondition[]): Record<string, unknown> => {
    const formData: Record<string, unknown> = {};
    
    filters.forEach(filter => {
      formData[filter.field] = filter.value;
    });
    
    return formData;
  };

  useEffect(() => {
    if (engine) {
      const filters = engine.getState().filters;
      if (filters.length > 0) {
        const newFormData = convertFiltersToFormData(filters);
        setFormData(_ => ({
          ...buildDefaultValues(filterForm || []),
          ...newFormData
        }));
      } else {
        setFormData(buildDefaultValues(filterForm || []));
      }
    }
  }, [engine, filterForm]);

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
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        submitLabel={t("datatable.filters_submit")}
      />
    </div>
  );
}