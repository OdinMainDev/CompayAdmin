import type { DatatableColumn } from "../domain/entities/DatatableColumn";
import type { DatatableConfig } from "../domain/entities/DatatableConfig";
import type { FilterCondition, FilterOperator } from "../domain/value-objects/FilterCondition";

export class FilterManager<T> {
  constructor(private config: DatatableConfig<T>) {}

  normalize(filters: FilterCondition[]): FilterCondition[] {
    return filters
      .filter(filter => this.isValidFilter(filter))
      .map(filter => this.normalizeFilter(filter));
  }

  private isValidFilter(filter: FilterCondition): boolean {
    if (!filter.field || !filter.operator) {
      return false;
    }

    const column = this.config.columns.find(col => col.id === filter.field);
    if (!column || !column.filterable) {
      return false;
    }

    return this.isValidOperatorForColumn(filter.operator, column);
  }

  private isValidOperatorForColumn(operator: FilterOperator, column: DatatableColumn<T>): boolean {
    const operatorGroups = {
      text: ['contains', 'notContains', 'startsWith', 'endsWith', 'equals', 'notEquals', 'isEmpty', 'isNotEmpty'],
      number: ['equals', 'notEquals', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual', 'between', 'notBetween', 'in', 'notIn'],
      date: ['equals', 'notEquals', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual', 'between', 'notBetween'],
      select: ['equals', 'notEquals', 'in', 'notIn', 'isNull', 'isNotNull'],
      range: ['between', 'notBetween', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual'],
      custom: ['equals', 'notEquals', 'contains', 'notContains'] 
    };

    const columnType = column.filter?.type || 'text';
    return operatorGroups[columnType]?.includes(operator) || false;
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
      value2: this.normalizeValue2(filter.value2, column)
    };
  }

  private normalizeValue2(value: unknown, column: DatatableColumn<T>): unknown {
    if (!value) return undefined;

    if (column.filter?.type === 'number' && typeof value === 'string') {
      return parseFloat(value);
    }

    if (column.filter?.type === 'date') {
      return new Date(value as string);
    }

    return value;
  }

  createSearchFilters(searchTerm: string, columns: DatatableColumn<T>[]): FilterCondition[] {
    if (!searchTerm.trim()) {
      return [];
    }

    const searchableColumns = columns.filter(col => 
      col.filterable && col.filter?.type === 'text'
    );

    if (searchableColumns.length === 0) {
      return [];
    }

    if (searchableColumns.length === 1) {
      return [{
        field: searchableColumns[0].id,
        operator: 'contains',
        value: searchTerm
      }];
    }

    return [{
      field: '_search',
      operator: 'contains',
      value: searchTerm,
      logic: 'or'
    }];
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

      const operator = column.filter?.operator || this.getDefaultOperator(column);
      
      filters.push({
        field,
        operator,
        value
      });
    });

    return this.normalize(filters);
  }

  private getDefaultOperator(column: DatatableColumn<T>): FilterOperator {
    const type = column.filter?.type || 'text';
    
    const defaultOperators: Record<string, FilterOperator> = {
      text: 'contains',
      number: 'equals',
      date: 'equals',
      select: 'equals',
      range: 'between',
      custom: 'equals'
    };

    return defaultOperators[type] || 'equals';
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