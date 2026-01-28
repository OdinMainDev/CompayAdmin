import React, { useState } from 'react';
import { DatatableEngine } from '@/features/datatable-core/runtime/DatatableEngine';
import type { DatatableConfig } from '@/features/datatable-core/domain/entities/DatatableConfig';
import { DatatableFilters } from './DatatableFilters';
import { Button, ButtonGroup, Dropdown, Form } from 'react-bootstrap';
import type { DatatableColumn } from '@/features/datatable-core/domain/entities/DatatableColumn';
import { useDatatableState } from '@/features/datatable-core/ui/hooks/useDatatableState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEyeSlash, faTableColumns } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { handleExport } from '../../utils/export';

interface DatatableHeaderProps<T> {
  config: DatatableConfig<T>;
  engine: DatatableEngine<T>;
  onAction: (actionId: string, formData?: Record<string, unknown>) => Promise<void>;
}

export function DatatableHeader<T>({
  config,
  engine,
  onAction,
}: DatatableHeaderProps<T>): React.ReactElement {
  const state = useDatatableState(engine);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const { t } = useTranslation('panel');

  const visibleColumns = Object.entries(state.columnState.visibility)
    .filter(([_, isVisible]) => isVisible !== false)
    .map(([columnId]) => columnId);

  const hideableColumns = config.columns.filter(
    (column: DatatableColumn<T>) => (column.visible ?? true) !== false,
  );

  const handleQuickAction = async (actionId: string) => {
    const action = config.quickActions?.find((a) => a.id === actionId);
    if (!action) return;
    await onAction(actionId);
  };

  const handleColumnToggle = (columnId: string) => {
    const isCurrentlyVisible = state.columnState.visibility[columnId] !== false;
    engine.updateColumnVisibility(columnId, !isCurrentlyVisible);
  };

  const showAllColumns = () => {
    config.columns.forEach((column) => {
      engine.updateColumnVisibility(column.id, true);
    });
  };

  const hideAllColumns = () => {
    config.columns.forEach((column) => {
      engine.updateColumnVisibility(column.id, false);
    });
  };

  const selectedCount = state.selection.size;
  const showBulkActions = selectedCount > 0 && config.selection?.actions;

  return (
    <div
      style={{
        padding: '1rem',
        borderBottom: '1px solid #e9ecef',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flex: 1,
          }}
        >
          {config.quickActions && config.quickActions.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {config.quickActions.map((action) => (
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

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            justifyContent: 'center',
          }}
        >
          {(config.ui?.columnVisibility ?? true) && hideableColumns.length > 0 && (
            <div className="position-relative">
              <Dropdown
                show={showColumnDropdown}
                onToggle={() => setShowColumnDropdown(!showColumnDropdown)}
                align="end"
              >
                <Dropdown.Toggle
                  variant="outline-warning"
                  size="sm"
                  id="column-selector-toggle"
                  className="d-flex align-items-center gap-1 text-black"
                  style={{
                    position: 'relative',
                  }}
                >
                  <FontAwesomeIcon icon={faTableColumns} />
                  <span>{t('datatable.columns')}</span>
                  <span className="badge bg-primary rounded-pill ms-1">
                    {visibleColumns.length}/{config.columns.length}
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu
                  style={{
                    minWidth: '250px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: '0.5rem',
                    zIndex: 99999,
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2 px-2">
                    <h6 className="mb-0 fw-bold">{t('datatable.manage_columns')}</h6>
                  </div>

                  <div className="dropdown-divider my-1"></div>

                  <div className="px-2 small text-muted mb-1">{t('datatable.all_columns')}</div>
                  {config.columns.map((column: DatatableColumn<T>) => {
                    const isVisible = state.columnState.visibility[column.id] !== false;

                    return (
                      <div key={column.id} className="px-2 py-1 d-flex align-items-center">
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
                          <FontAwesomeIcon
                            icon={faEyeSlash}
                            className="black-text text-muted ms-2"
                          />
                        )}
                      </div>
                    );
                  })}

                  <div className="dropdown-divider my-2"></div>

                  <div className="d-flex flex-wrap gap-1 px-2">
                    <button
                      className="btn btn-sm btn-outline-primary flex-grow-1"
                      onClick={showAllColumns}
                      disabled={state.loading}
                    >
                      {t('datatable.show_all')}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary flex-grow-1"
                      onClick={hideAllColumns}
                      disabled={state.loading}
                    >
                      {t('datatable.hide_all')}
                    </button>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}

          {!config.export?.disabled && (
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-success"
                size="sm"
                disabled={state.loading || state.data.length === 0}
                id="export-dropdown"
              >
                <FontAwesomeIcon icon={faDownload} className="me-1" />
                {t('datatable.export')}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {(config.export?.formats ?? ['excel', 'csv', 'pdf']).map((format) => (
                  <Dropdown.Item
                    key={format}
                    onClick={async () => {
                      await handleExport(
                        state.data as Record<string, unknown>[],
                        format,
                        config.export?.fileName ?? 'export',
                      );
                    }}
                  >
                    {format.toUpperCase()}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}

          {showBulkActions && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <span className="badge bg-primary rounded-pill">{selectedCount}</span>
                <span className="small text-muted">selected</span>
              </div>

              {config.selection?.actions?.map((action) => (
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

        {(config.filtering?.enabled ?? true) && (
          <div style={{ marginLeft: 'auto' }}>
            <DatatableFilters config={config} engine={engine} />
          </div>
        )}
      </div>
    </div>
  );
}
