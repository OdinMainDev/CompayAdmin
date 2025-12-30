import type { DatatableColumn } from "../domain/entities/DatatableColumn";
import type { DatatableConfig } from "../domain/entities/DatatableConfig";
import type { FilterCondition } from "../domain/value-objects/FilterCondition";

export class FilterManager<T> {
  constructor(private config: DatatableConfig<T>) {}

  normalize(filters: FilterCondition[]): FilterCondition[] {
    return filters
      .filter(filter => this.isValidFilter(filter))
      .map(filter => this.normalizeFilter(filter));
  }

  private isValidFilter(filter: FilterCondition): boolean {
    if (!filter.field) {
      return false;
    }

    const column = this.config.columns.find(col => col.id === filter.field);
    if (!column || !column.filterable) {
      return false;
    }

    return true;
  }

  private normalizeFilter(filter: FilterCondition): FilterCondition {
    const column = this.config.columns.find(col => col.id === filter.field);
    if (!column) {
      return filter;
    }

    let normalizedValue = filter.value;
    
    if (column.filter?.type === 'number' && typeof filter.value === 'string') {
      normalizedValue = parseFloat(filter.value);
    }

    if (column.filter?.type === 'date' && filter.value) {
      normalizedValue = new Date(filter.value as string);
    }

    return {
      ...filter,
      value: normalizedValue,
    };
  }

  convertFormToFilters(formData: Record<string, unknown>): FilterCondition[] {
    const filters: FilterCondition[] = [];

    Object.entries(formData).forEach(([field, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }

      const column = this.config.columns.find(col => col.id === field);
      if (!column?.filterable) {
        return;
      }

      filters.push({
        field,
        value
      });
    });

    return this.normalize(filters);
  }

  mergeFilters(existing: FilterCondition[], newFilters: FilterCondition[]): FilterCondition[] {
    const merged = [...existing];
    
    newFilters.forEach(newFilter => {
      const existingIndex = merged.findIndex(f => f.field === newFilter.field);
      
      if (existingIndex >= 0) {
        merged[existingIndex] = newFilter;
      } else {
        merged.push(newFilter);
      }
    });

    return merged.filter(filter => 
      filter.value !== undefined && filter.value !== null && filter.value !== ''
    );
  }
}