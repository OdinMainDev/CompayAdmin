import { useState, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { UnifiedFieldRegistry } from '../UnifiedFieldRegistry';
import type { IField } from '../../form-core/domain/field/IField';
import type { RepeaterFieldExtra, RepeaterFieldValue } from '../../form-core/domain/field/RepeaterField';
import { v4 as uuidv4 } from 'uuid';
import { createFieldCopy } from '../../form-core/domain/utils/copy';

interface RepeaterItem {
  id: string;
  values: any[];
}


export const RepeaterRenderer = (
  field: IField<RepeaterFieldValue, RepeaterFieldExtra>,
  onChange: (value: RepeaterFieldValue) => void
) => {
  const elements = field.extra?.elements ?? [];

  const [items, setItems] = useState<RepeaterItem[]>(() => {
    if (Array.isArray(field.value) && field.value.length > 0) {
      return field.value as RepeaterItem[];
    }
    return [{ 
      id: uuidv4(), 
      values: elements.map(f => f.value ?? null) 
    }];
  });

  const addItem = useCallback(() => {
    const maxItems = field.extra?.maxItems ?? Infinity;
    if (items.length >= maxItems) return;
    
    const newItem: RepeaterItem = { 
      id: uuidv4(), 
      values: elements.map(f => f.value ?? null) 
    };
    const newItems = [...items, newItem];
    setItems(newItems);
    onChange(newItems);
  }, [items, elements, field.extra?.maxItems, onChange]);

  const removeItem = useCallback((id: string) => {
    const minItems = field.extra?.minItems ?? 1;
    if (items.length <= minItems) return;
    
    const newItems = items.filter(i => i.id !== id);
    setItems(newItems);
    onChange(newItems);
  }, [items, field.extra?.minItems, onChange]);

  const copyItem = useCallback((id: string) => {
    const maxItems = field.extra?.maxItems ?? Infinity;
    if (items.length >= maxItems) return;
    
    const itemToCopy = items.find(i => i.id === id);
    if (!itemToCopy) return;
    
    const newItems = [...items, { ...itemToCopy, id: uuidv4() }];
    setItems(newItems);
    onChange(newItems);
  }, [items, field.extra?.maxItems, onChange]);

  const updateItemValue = useCallback((itemId: string, fieldName: string, value: any) => {
    setItems(prevItems => {
      const newItems = prevItems.map(item => {
        if (item.id === itemId) {
          const fieldIndex = elements.findIndex(f => f.name === fieldName);
          if (fieldIndex >= 0) {
            const updatedValues = [...item.values];
            updatedValues[fieldIndex] = value;
            return { ...item, values: updatedValues };
          }
        }
        return item;
      });
      
      onChange(newItems);
      return newItems;
    });
  }, [elements, onChange]);

  const styles = {
    container: { 
      display: 'flex', 
      flexDirection: 'column' as const, 
      gap: '1rem',
      marginBottom: '1rem'
    },
    item: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'flex-start',
      padding: '1rem',
      marginBottom: '1rem',
      border: '1px solid #dee2e6',
      borderRadius: '0.375rem',
      backgroundColor: '#f8f9fa'
    },
    itemInputs: { 
      display: 'flex', 
      flexWrap: 'wrap' as const, 
      gap: '1rem', 
      flex: 1 
    },
    buttonContainer: { 
      display: 'flex', 
      flexDirection: 'column' as const, 
      gap: '0.5rem', 
      minWidth: '120px' 
    },
    addButtonContainer: {
      display: 'flex',
      justifyContent: 'center'
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ marginBottom: '0.5rem' }}>
        <h6>{field.label}</h6>
        {field.extra?.helperText && (
          <small className="text-muted">{field.extra.helperText}</small>
        )}
      </div>
      
      {items.map((item) => (
        <div
          key={item.id}
          style={styles.item}
        >
          <div style={styles.itemInputs}>
            {elements.map((f, fIdx) => {
              const fieldCopy = createFieldCopy(f, item.values[fIdx]);
              return (
                <div key={`${item.id}-${f.name}`} style={{ minWidth: '200px' }}>
                  {UnifiedFieldRegistry.render(
                    fieldCopy,
                    v => updateItemValue(item.id, f.name, v)
                  )}
                </div>
              );
            })}
          </div>
          
          <div style={styles.buttonContainer}>
            {items.length > (field.extra?.minItems ?? 1) && (
              <Button 
                size="sm"
                variant="outline-danger" 
                onClick={() => removeItem(item.id)}
              >
                Удалить
              </Button>
            )}
            <Button 
              size="sm"
              variant="outline-secondary" 
              onClick={() => copyItem(item.id)}
            >
              Копировать
            </Button>
          </div>
        </div>
      ))}
      
      <div style={styles.addButtonContainer}>
        <Button 
          variant="outline-primary"
          onClick={addItem}
          disabled={items.length >= (field.extra?.maxItems ?? Infinity)}
        >
          + Добавить элемент
        </Button>
      </div>
    </div>
  );
};

export default RepeaterRenderer;