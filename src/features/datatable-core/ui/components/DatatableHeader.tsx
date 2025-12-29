import React, { useState } from 'react';
import { DatatableEngine } from '../../runtime/DatatableEngine';
import type { DatatableConfig } from '../../domain/entities/DatatableConfig';
import type { DatatableState } from '../../domain/entities/DatatableState';
import { DatatableFilters } from './DatatableFilters';
import type { FilterCondition } from '../../domain/value-objects/FilterCondition';
import { Dropdown, Form } from 'react-bootstrap';

interface DatatableHeaderProps<T = unknown> {
  config: DatatableConfig<T>;
  state: DatatableState<T>;
  engine: DatatableEngine<T>;
  onSearch: (term: string) => void;
  onAction: (actionId: string, formData?: Record<string, unknown>) => Promise<void>;
}

export function DatatableHeader<T>({
  config,
  state,
  engine,
  onSearch,
  onAction
}: DatatableHeaderProps<T>): React.ReactElement {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  
  const visibleColumns = Object.entries(state.columnState.visibility)
    .filter(([_, isVisible]) => isVisible !== false)
    .map(([columnId]) => columnId);
  
  const hideableColumns = config.columns.filter(column => 
    column.visible !== false
  );
  
  const handleFilter = (filters: FilterCondition[]) => {
    if (engine) {
      engine.filter(filters);
    }
  };

  const handleQuickAction = async (actionId: string) => {
    const action = config.quickActions?.find(a => a.id === actionId);
    if (!action) return;
    
    if (action.form) {
      const formBuilder = engine.getFormBuilder();
      const formSchema = formBuilder.createActionForm(action.id);
      const formInstance = formBuilder.getFormInstance(formSchema);
      
      const result = await formInstance.submit();
      if (result.valid) {
        await onAction(actionId, result.data);
      }
    } else {
      await onAction(actionId);
    }
  };
  
  const handleColumnToggle = (columnId: string) => {
    const isCurrentlyVisible = state.columnState.visibility[columnId] !== false;
    engine.getStateManager().updateColumnVisibility(columnId, !isCurrentlyVisible)
  };
  
  const showAllColumns = () => {
    config.columns.forEach(column => {
        engine.getStateManager().updateColumnVisibility(column.id, true)
    });
  };
  
  const hideAllColumns = () => {
    config.columns.forEach(column => {
        engine.getStateManager().updateColumnVisibility(column.id, false)
    });
  };
  
  const selectedCount = state.selection.size;
  const showBulkActions = selectedCount > 0 && config.selection?.actions;
  
  return (
    <div style={{
      padding: '1rem',
      borderBottom: '1px solid #e9ecef'
    }}>
      <div style={{ marginBottom: '1rem' }}>
        {config.title && (
          <h3 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#343a40'
          }}>{config.title}</h3>
        )}
        
        {config.subtitle && (
          <p style={{
            margin: '0.25rem 0 0 0',
            color: '#6c757d',
            fontSize: '0.875rem'
          }}>{config.subtitle}</p>
        )}
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flex: 1
        }}>
          {config.quickActions && config.quickActions.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {config.quickActions.map(action => (
                <button
                  key={action.id}
                  className={`btn btn-${action.variant || 'secondary'} btn-sm`}
                  onClick={() => handleQuickAction(action.id)}
                  disabled={state.loading}
                >
                  {action.icon && <span style={{ marginRight: '0.25rem' }}>{action.icon}</span>}
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          {config.ui?.columnVisibility && hideableColumns.length > 0 && (
            <div className="position-relative">
              <Dropdown 
                show={showColumnDropdown} 
                onToggle={() => setShowColumnDropdown(!showColumnDropdown)}
                align="end"
              >
                <Dropdown.Toggle 
                  variant="outline-secondary" 
                  size="sm" 
                  id="column-selector-toggle"
                  className="d-flex align-items-center gap-1"
                >
                  <i className="fas fa-columns"></i>
                  <span>Columns</span>
                  <span className="badge bg-primary rounded-pill ms-1">
                    {visibleColumns.length}/{config.columns.length}
                  </span>
                </Dropdown.Toggle>
                
                <Dropdown.Menu style={{ 
                  minWidth: '250px', 
                  maxHeight: '400px',
                  overflowY: 'auto',
                  padding: '0.5rem',
                  zIndex: 60

                }}>
                  <div className="d-flex justify-content-between align-items-center  mb-2 px-2">
                    <h6 className="mb-0 fw-bold">Manage Columns</h6>
                    <div className="d-flex gap-1">
                      <button 
                        className="btn btn-sm btn-link p-0"
                        onClick={showAllColumns}
                        title="Show all columns"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-link p-0"
                        onClick={hideAllColumns}
                        title="Hide optional columns"
                      >
                        <i className="fas fa-eye-slash"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider my-1"></div>
                  
                  <div className="px-2 small text-muted mb-1">All Columns</div>
                  {config.columns.map(column => {
                    const isVisible = state.columnState.visibility[column.id] !== false;
                    
                    return (
                      <div 
                        key={column.id} 
                        className="px-2 py-1 d-flex align-items-center"
                      >
                        <Form.Check
                          type="checkbox"
                          id={`column-${column.id}`}
                          label={column.label || column.id}
                          checked={isVisible}
                          onChange={() => handleColumnToggle(column.id)}
                          disabled={state.loading}
                          className="w-100 text-dark"
                        />
                        {!isVisible && (
                          <i className="black-text fas fa-eye-slash text-muted ms-2" title="Hidden"></i>
                        )}
                      </div>
                    );
                  })}
                  
                  <div className="dropdown-divider my-2"></div>
                  
                  <div className="px-2 small text-muted mb-1">Quick Actions</div>
                  <div className="d-flex flex-wrap gap-1 px-2">
                    <button 
                      className="btn btn-sm btn-outline-primary flex-grow-1"
                      onClick={showAllColumns}
                      disabled={state.loading}
                    >
                      Show All
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-secondary flex-grow-1"
                      onClick={hideAllColumns}
                      disabled={state.loading}
                    >
                      Hide Optional
                    </button>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
          
          {config.export?.enabled && (
            <button
              className="btn btn-outline-success btn-sm"
              onClick={() => onAction('export')}
              disabled={state.loading || state.data.length === 0}
            >
              <i className="fas fa-download me-1"></i>
              Export
            </button>
          )}
          
          {showBulkActions && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <span className="badge bg-primary rounded-pill">
                  {selectedCount}
                </span>
                <span className="small text-muted">selected</span>
              </div>
              
              {config.selection?.actions?.map(action => (
                <button
                  key={action.id}
                  className={`btn btn-${action.variant || 'secondary'} btn-sm`}
                  onClick={() => onAction(action.id)}
                >
                  {action.icon && <span className="me-1">{action.icon}</span>}
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {config.filtering?.enabled && (
          <div style={{ marginLeft: 'auto' }}>
            <DatatableFilters
              config={config}
              engine={engine}
              onFilter={handleFilter}
            />
          </div>
        )}
      </div>
    </div>
  );
}