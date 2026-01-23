import React, { useState, useMemo, useEffect } from 'react';
import type { DatatableConfig } from '@/features/datatable-core/domain/entities/DatatableConfig';
import type { DatatableEngine } from '@/features/datatable-core/runtime/DatatableEngine';
import { DatatableFiltersForm } from './DatatableFiltersForm';
import type { FilterCondition } from '@/features/datatable-core/domain/value-objects/FilterCondition';
import { buildBackendFilters } from '../../filters/buildBackendFilters';

interface DatatableFiltersProps<T> {
  config: DatatableConfig<T>;
  engine: DatatableEngine<T>;
}

type FilterMode = 'inline' | 'modal';

export function DatatableFilters<T>({
  config,
  engine
}: DatatableFiltersProps<T>): React.ReactElement | null {
  const [showModal, setShowModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>(
    () => engine.getState().filters ?? []
  );

  const filterMode: FilterMode = (config.filtering?.mode as FilterMode) || 'modal';

  const filterForm = useMemo(() => {
    return buildBackendFilters(engine.getState().remoteFilters);
  }, [engine.getState().remoteFilters]);

  useEffect(() => {
    if (!showModal) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('overflow-hidden');

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('overflow-hidden');
    };
  }, [showModal]);

  useEffect(() => {
    if (!showModal) return;
    setActiveFilters(engine.getState().filters ?? []);
  }, [showModal, engine]);

  if (filterForm.length === 0) {
    return null;
  }

  const handleFilter = (filters: FilterCondition[]) => {
    setActiveFilters(filters);
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
    const count = activeFilters.length;

    return (
      <>
        <div className="datatable-filters-modal-trigger">
          <button
            type="button"
            className={[
              'btn btn-outline-primary btn-sm',
              'inline-flex items-center gap-2',
              'rounded-md',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2',
              'transition'
            ].join(' ')}
            onClick={() => setShowModal(true)}
          >
            <i className="fas fa-filter me-2" aria-hidden="true"></i>
            <span>Filter</span>

            {/* индикатор только если есть выбранные */}
            {count > 0 && (
              <span
                className={[
                  'ml-1 inline-flex min-w-[1.25rem] items-center justify-center',
                  'rounded-full bg-blue-600 px-1.5 py-0.5',
                  'text-[11px] font-semibold leading-none text-white'
                ].join(' ')}
                aria-label={`Selected filters: ${count}`}
              >
                {count}
              </span>
            )}
          </button>
        </div>

        {showModal && (
          <div
            className={[
              'modal fade show',
              'fixed inset-0 z-50'
            ].join(' ')}
            style={{ display: 'block' }}
            role="dialog"
            aria-modal="true"
            onClick={() => setShowModal(false)}
          >
            <div
              className={[
                'modal-dialog modal-md',
                'mx-auto my-6 sm:my-10',
                'w-[calc(100%-1.5rem)] sm:w-auto'
              ].join(' ')}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content rounded-lg border border-slate-200 shadow-xl">
                <div className="modal-header">
                  <h5 className="modal-title inline-flex items-center gap-2">
                    <i className="fas fa-filter me-2" aria-hidden="true"></i>
                    <span>Filters</span>

                    {count > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold leading-none text-white">
                        {count}
                      </span>
                    )}
                  </h5>

                  <button
                    type="button"
                    className={[
                      'btn-close',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 rounded'
                    ].join(' ')}
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  ></button>
                </div>

                {}
                <div className="modal-body max-h-[70vh] overflow-y-auto">
                  <DatatableFiltersForm
                    engine={engine}
                    filterForm={filterForm}
                    onFilterChange={(filters) => {
                      handleFilter(filters);
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
            className="modal-backdrop fade show fixed inset-0 z-40 bg-black/40"
            onClick={() => setShowModal(false)}
          ></div>
        )}
      </>
    );
  }

  return null;
}
