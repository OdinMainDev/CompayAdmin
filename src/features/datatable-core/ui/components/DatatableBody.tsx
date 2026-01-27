import React from 'react';
import type { DatatableConfig } from '@/features/datatable-core/domain/entities/DatatableConfig';
import type { SortState } from '@/features/datatable-core/domain/value-objects/SortDirection';
import type { DatatableColumn } from '@/features/datatable-core/domain/entities/DatatableColumn';
import { useDatatableState } from '@/features/datatable-core/ui/hooks/useDatatableState';
import type { DatatableEngine } from '@/features/datatable-core/runtime/DatatableEngine';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faInbox, faSort, faSortDown, faSortUp, IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface DatatableBodyProps<T> {
  config: DatatableConfig<T>;
  engine: DatatableEngine<T>;
  onSort: (column: string, direction: SortState['direction']) => void;
  onRowClick?: (row: T, event: React.MouseEvent) => void;
  onSelectionChange: (selectedIds: string[]) => void;
}

export function DatatableBody<T>({
  config,
  engine,
  onSort,
  onRowClick,
  onSelectionChange
}: DatatableBodyProps<T>): React.ReactElement {
  const state = useDatatableState(engine); 


  const visibleColumns = config.columns.filter((col: DatatableColumn<T>) => 
    state.columnState.visibility[col.id] !== false
  );
  const { t } = useTranslation('panel');
  
  const getRowId = (row: T): string => {
    return (row as { id: string }).id || String((row as { _id: string })._id);
  };
  
  const handleSort = (column: DatatableColumn<T>) => {
    debugger;
    if (!column.sortable || state.loading) return;
    
    const currentSort = state.sort.find(s => s.column === column.id);
    const newDirection = currentSort?.direction === 'asc' ? 'desc' : 'asc';
    
    onSort(column.id, newDirection);
  };
  
  const handleRowClick = (row: T, event: React.MouseEvent) => {
    if (onRowClick) {
      onRowClick(row, event);
    }
  };
  
  const handleSelectAll = () => {
    if (state.selection.size === state.data.length) {
      onSelectionChange([]);
    } else {
      const allIds = state.data.map(row => getRowId(row));
      onSelectionChange(allIds);
    }
  };
  
  const handleSelectRow = (rowId: string) => {
    const newSelection = new Set(state.selection);
    
    if (newSelection.has(rowId)) {
      newSelection.delete(rowId);
    } else {
      if (config.selection?.mode === 'single') {
        newSelection.clear();
      }
      newSelection.add(rowId);
    }
    
    onSelectionChange(Array.from(newSelection));
  };
  
  const getSortIcon = (columnId: string): IconDefinition => {
    const sort = state.sort.find(s => s.column === columnId);
    if (!sort) return faSort;
    return sort.direction === 'asc' ? faSortUp : faSortDown;
  };
  
  if (state.loading && state.data.length === 0) {
    return (
      <div className="datatable-loading">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (state.error) {
    let errorMessage: string;
  
    if ('success' in state.error && state.error.success === false) {
      errorMessage = state.error.message || state.error.error || 'Unknown API error';
    } else if (state.error instanceof Error) {
      errorMessage = state.error.message;
    } else {
      errorMessage = 'Unknown error';
    }
  
    return (
      <div className="datatable-error">
        <div className="alert alert-danger">
          <FontAwesomeIcon icon={faExclamationTriangle} className='me-2'/>
          {errorMessage}
        </div>
        <button 
          className="btn btn-primary mt-2"
          onClick={() => window.location.reload()}
        >
          {t("datatable.retry_request")}
        </button>
      </div>
    );
  }
  
  if (state.data.length === 0) {
    return (
      <div className="datatable-empty">
        <div className="empty-state">
          <FontAwesomeIcon size="3x" icon={faInbox} className='text-muted mb-3'/>
          <h5>{t("datatable.no_data_available")}</h5>
          <p className="text-muted">{t("datatable.records_null")}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="datatable-body">
      <div className="table-responsive">
        <table className={`table table-${config.ui?.density || 'normal'} 
          ${config.ui?.striped ? 'table-striped' : ''} 
          ${config.ui?.bordered ? 'table-bordered' : ''} 
          ${config.ui?.hoverable ? 'table-hover' : ''}`}>
          
          <thead className={config.ui?.stickyHeader ? 'sticky-top' : ''}>
            <tr>
              {config.selection?.enabled && config.selection.mode === 'checkbox' && (
                <th style={{ width: '40px' }}>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={state.selection.size === state.data.length && state.data.length > 0}
                      onChange={handleSelectAll}
                      disabled={state.loading}
                    />
                  </div>
                </th>
              )}
              
              {visibleColumns.map(column => (
                <th
                  key={column.id}
                  className={`
                    ${column.sortable ? 'sortable' : ''}
                    ${column.align ? `text-${column.align}` : ''}
                    ${column.headerClassName || ''}
                    ${column.sticky ? 'sticky-column' : ''}
                  `}
                  style={{
                    width: column.width,
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    ...(column.sticky === 'left' ? { position: 'sticky', left: 0 } : {}),
                    ...(column.sticky === 'right' ? { position: 'sticky', right: 0 } : {})
                  }}
                  onClick={() => column.sortable && handleSort(column)}
                >
                  <div className="d-flex align-items-center">
                    {column.headerRender 
                      ? column.headerRender(column)
                      : column.label
                    }
                    
                    {column.sortable && (
                      <FontAwesomeIcon icon={getSortIcon(column.id)} className='ms-2'/>
                    )}
                    
                    {column.resizable && (
                      <div className="resize-handle"></div>
                    )}
                  </div>
                </th>          
              ))}
               {config.rowActions && config.rowActions.length > 0 && (
                <th className="text-center">
                  {t('datatable.actions')}
                </th>
              )}
            </tr>
          </thead>
          
          <tbody>
            {state.data.map((row, index) => {
              const rowId = getRowId(row);
              const isSelected = state.selection.has(rowId);
              
              return (
                <tr
                  key={rowId}
                  className={`
                    ${isSelected ? 'table-active' : ''}
                    ${onRowClick ? 'clickable-row' : ''}
                  `}
                  onClick={(e) => handleRowClick(row, e)}
                >
                  {config.selection?.enabled && config.selection.mode === 'checkbox' && (
                    <td>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={isSelected}
                          onChange={() => handleSelectRow(rowId)}
                        />
                      </div>
                    </td>
                  )}
                  
                  {visibleColumns.map(column => {
                    const rawValue = row[column.field as keyof T];
                    const cellValue = column.formatter 
                      ? column.formatter(rawValue, row)
                      : rawValue;
                    
                    return (
                      <td
                        key={`${rowId}-${column.id}`}
                        className={`
                          ${column.align ? `text-${column.align}` : ''}
                          ${column.sticky ? 'sticky-cell' : ''}
                        `}
                        style={{
                          ...(column.sticky === 'left' ? { position: 'sticky', left: 0 } : {}),
                          ...(column.sticky === 'right' ? { position: 'sticky', right: 0 } : {})
                        }}
                      >
                        {column.render 
                          ? column.render(row, cellValue, index)
                          : String(cellValue ?? '')
                        }
                      </td>
                    );
                  })}
                  
                  {config.rowActions && config.rowActions.length > 0 && (
                    <td>
                        <div className="row-actions">
                        {config.rowActions
                            .filter(action => action.visible !== false)
                            .map(action => (
                            <button
                                key={action.id}
                                className={`btn btn-${action.variant || 'secondary'} btn-sm ms-1`}
                                onClick={(e) => {
                                e.stopPropagation();
                                action.handler({
                                    currentRow: row,
                                });
                                }}
                                title={action.label}
                            >
                                {action.icon || action.label}
                            </button>
                            ))}
                        </div>
                    </td>
                    )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}