import { Dropdown, Form } from 'react-bootstrap';
import type { DatatableColumn } from '@/features/datatable-core/domain/entities/DatatableColumn';
import { useState } from 'react';

interface DropdownColumnSelectorProps<T = unknown> {
  columns: DatatableColumn<T>[];
  visibleColumns: string[];
  onColumnsChange: (visibleColumns: string[]) => void;
}

export function DropdownColumnSelector<T>({
  columns,
  visibleColumns,
  onColumnsChange
}: DropdownColumnSelectorProps<T>) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(visibleColumns);
  
  const handleColumnToggle = (columnId: string) => {
    const newColumns = selectedColumns.includes(columnId)
      ? selectedColumns.filter(id => id !== columnId)
      : [...selectedColumns, columnId];
    
    setSelectedColumns(newColumns);
    onColumnsChange(newColumns);
  };
  
  return (
    <Dropdown align="end">
      <Dropdown.Toggle variant="outline-secondary" size="sm" id="column-toggle">
        <i className="fas fa-columns me-1"></i>
        Columns
      </Dropdown.Toggle>
      
      <Dropdown.Menu style={{ minWidth: '200px', padding: '0.5rem' }}>
        <div className="px-2 mb-2 small text-muted">Visible Columns</div>
        {columns.map(column => (
          <div key={column.id} className="px-2 py-1">
            <Form.Check
              type="checkbox"
              id={`column-dropdown-${column.id}`}
              label={column.label}
              checked={selectedColumns.includes(column.id)}
              onChange={() => handleColumnToggle(column.id)}
            />
          </div>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}