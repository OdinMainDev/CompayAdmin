import React, { useState, useMemo } from 'react';
import type { DatatableConfig } from '../../domain/entities/DatatableConfig';
import type { DatatableEngine } from '../../runtime/DatatableEngine';
import { DatatableFiltersForm } from './DatatableFiltersForm';
import { useDatatableState } from '../hooks/useDatatableState';
import type { FilterCondition } from '../../domain/value-objects/FilterCondition';

interface DatatableFiltersProps<T> {
  config: DatatableConfig<T>;
  engine: DatatableEngine<T>;
}

export function DatatableFilters<T>({
  config,
  engine
}: DatatableFiltersProps<T>): React.ReactElement | null {
  const [showModal, setShowModal] = useState(false);
  const [activeFilters] = useState(engine.getState().filters);
  const filterMode = config.filtering?.mode || 'inline';
  
  const filterForm = useMemo(() => {
    if (config.filterForm) {
      return config.filterForm;
    }
    return [];
  }, [config.filterForm]);
  
  if (filterForm.length === 0) {
    return null;
  }
  
  const handleFilter = (filters: FilterCondition[]) => {
    engine.filter(filters);
  };
  
  if (filterMode === 'inline') {
    return (
      <div className="datatable-filters datatable-filters-inline">
        <DatatableFiltersForm
          engine={engine}
          filterForm={filterForm}
          onFilterChange={handleFilter}
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
            {activeFilters.length > 0 && (
              <span className="badge bg-primary ms-2">
                {activeFilters.length}
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
                    {activeFilters.length > 0 && (
                      <span className="badge bg-primary ms-2">
                        {activeFilters.length}
                      </span>
                    )}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <DatatableFiltersForm
                    engine={engine}
                    filterForm={filterForm}
                    onFilterChange={(filters) => {
                      engine.filter(filters);
                      setShowModal(false);
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