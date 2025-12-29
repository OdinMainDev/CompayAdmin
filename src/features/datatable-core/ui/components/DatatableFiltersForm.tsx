import { useState } from "react";
import type { RawFormSection } from "../../../form-platform/packages/form-core/domain/field/RawFormSection";
import { buildDefaultValues } from "../../../form-platform/packages/form-core/domain/utils/default";
import type { FilterCondition } from "../../domain/value-objects/FilterCondition";
import UnifiedFormBuilder from "../../../form-platform/packages/form-react-adapter/UnifiedFormBuilder";

interface DatatableFiltersFormProps<T> {
  filterForm?: RawFormSection[];
  onFilterChange: (filters: FilterCondition[]) => void;
  className?: string;
}

export function DatatableFiltersForm<T>({
  filterForm,
  onFilterChange,
  className = ''
}: DatatableFiltersFormProps<T>): React.ReactElement | null {
  const [formData, setFormData] = useState<Record<string, unknown>>(() => 
    filterForm ? buildDefaultValues(filterForm) : {}
  );

  const convertFormToFilters = (data: Record<string, unknown>): FilterCondition[] => {
    const filters: FilterCondition[] = [];
    
    Object.entries(data).forEach(([field, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        filters.push({
          field,
          operator: 'contains',
          value
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
        json={filterForm}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}