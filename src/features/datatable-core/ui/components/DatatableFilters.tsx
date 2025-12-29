import React, { useState, useEffect, useMemo } from 'react';
import type { DatatableConfig } from '../../domain/entities/DatatableConfig';
import type { DatatableEngine } from '../../runtime/DatatableEngine';
import type { FilterCondition } from '../../domain/value-objects/FilterCondition';
import { DatatableFiltersForm } from './DatatableFiltersForm';

interface DatatableFiltersProps<T = unknown> {
  config: DatatableConfig<T>;
  engine: DatatableEngine<T>;
  onFilter: (filters: FilterCondition[]) => void;
  activeFilters?: FilterCondition[]; 
}

export function DatatableFilters<T = unknown>({
  config,
  engine,
  onFilter,
  activeFilters = []
}: DatatableFiltersProps<T>): React.ReactElement | null {
  const [showModal, setShowModal] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterCondition[]>(activeFilters);
  
  const filterMode = config.filtering?.mode || 'inline';
  
  const filterForm = useMemo(() => {
    if (config.filterForm) {
      return config.filterForm;
    }
    return [];
  }, [config.filterForm, config.columns, engine]);
  
  if (filterForm.length === 0) {
    return null;
  }
  
  if (filterMode === 'inline') {
    return (
      <div className="datatable-filters datatable-filters-inline">
        <DatatableFiltersForm
          filterForm={filterForm}
          onFilterChange={onFilter}
        />
      </div>
    );
  }
  
  if (filterMode === 'modal') {
    return (
      <>
        <div className="datatable-filters-modal-trigger">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => setShowModal(true)}
          >
            <i className="fas fa-filter me-2"></i>
            Filter
            {localFilters.length > 0 && (
              <span className="badge bg-primary ms-2">
                {localFilters.length}
              </span>
            )}
          </button>
        </div>
        
        {showModal && (
          <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="fas fa-filter me-2"></i>
                    Filters
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <DatatableFiltersForm
                    filterForm={filterForm}
                    onFilterChange={(filters) => {
                      setLocalFilters(filters);
                      onFilter(filters);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {showModal && (
          <div 
            className="modal-backdrop fade show"
            onClick={() => setShowModal(false)}
          ></div>
        )}
      </>
    );
  }
  
  return null;
}