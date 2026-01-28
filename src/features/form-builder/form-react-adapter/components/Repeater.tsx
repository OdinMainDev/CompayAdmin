import { useState, useCallback, useEffect, useRef } from 'react';
import { Button, Col, Collapse, Row } from 'react-bootstrap';
import { UnifiedFieldRegistry } from '../UnifiedFieldRegistry';
import type { IField } from '../../form-core/domain/field/IField';
import type {
  RepeaterFieldExtra,
  RepeaterFieldValue,
} from '../../form-core/domain/field/RepeaterField';
import { AnyField } from '@/features/form-builder/form-react-adapter/fields';
import { faTrashCan, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const RepeaterRenderer = (
  field: IField<RepeaterFieldValue, RepeaterFieldExtra>,
  onChange: (value: RepeaterFieldValue) => void,
) => {
  const elements = field.extra?.elements ?? [];
  

  const copyField = (f: AnyField): AnyField => {
    const copy = Object.create(Object.getPrototypeOf(f)) as AnyField;
    Object.assign(copy, f);
    return copy;
  };

  const [items, setItems] = useState<AnyField[][]>(() => {
    if (Array.isArray(field.value) && field.value.length > 0) {
      return field.value.map((item) =>
        elements.map((f) => {
          const copy = copyField(f);
          copy.value = item[copy.name] as typeof copy.value;
          return copy;
        }),
      );
    }
    return [elements.map(copyField)];
  });

  const [openItems, setOpenItems] = useState<Record<number, boolean>>(() => {
    const obj: Record<number, boolean> = {};
    items.forEach((_, idx) => (obj[idx] = true));
    return obj;
  });

  const isFirstRender = useRef(true);
  const deepEqual = (a: RepeaterFieldValue, b: RepeaterFieldValue) => {
    if (a.length !== b.length) return false;
  
    for (let i = 0; i < a.length; i++) {
      const objA = a[i];
      const objB = b[i];
  
      const keysA = Object.keys(objA);
      const keysB = Object.keys(objB);
  
      if (keysA.length !== keysB.length) return false;
  
      for (let key of keysA) {
        const valA = objA[key];
        const valB = objB[key];
  
        if (valA == null && valB == null) continue;
  
        if (typeof valA === "number" && typeof valB === "number" && isNaN(valA) && isNaN(valB)) continue;
  
        if (valA !== valB) return false;
      }
    }
  
    return true;
  };


  useEffect(() => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.map((oldField) => {
          const newFieldDef = elements.find((e) => e.name === oldField.name);
          if (!newFieldDef) return oldField;

          const copy = Object.create(Object.getPrototypeOf(newFieldDef)) as AnyField;
          Object.assign(copy, newFieldDef);
          copy.value = oldField.value;

          return copy;
        }),
      ),
    );
  }, [elements]);


  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
  
    const value: RepeaterFieldValue = items.map(item =>
      item.reduce((acc, f) => ({ ...acc, [f.name]: f.value }), {})
    );
    if (!deepEqual(value, field.value)) {
      onChange(value);
    }
  }, [items, field.value, onChange]);

  const addItem = useCallback(() => {
    if (items.length >= (field.extra?.maxItems ?? Infinity)) return;
    const newItem = elements.map(copyField);
    const newItems = [...items, newItem];
    setItems(newItems);
    setOpenItems((prev) => ({ ...prev, [newItems.length - 1]: true }));
  }, [items, elements, field.extra?.maxItems]);

  const removeItem = useCallback(
    (index: number) => {
      if (items.length <= (field.extra?.minItems ?? 1)) return;
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      setOpenItems((prev) => {
        const copy = { ...prev };
        delete copy[index];
        return copy;
      });
    },
    [items, field.extra?.minItems],
  );

  const updateItemValue = useCallback((itemIndex: number, field: AnyField, newValue: any) => {
    setItems((prevItems) =>
      prevItems.map((item, idx) => {
        if (idx !== itemIndex) return item;
        return item.map((f) => {
          if (f.name === field.name) {
            const copy = Object.create(Object.getPrototypeOf(f)) as AnyField;
            Object.assign(copy, f);
            copy.value = newValue as typeof f.value;
            return copy;
          }
          return f;
        });
      }),
    );
  }, []);

  const toggleItem = (index: number) =>
    setOpenItems((prev) => ({ ...prev, [index]: !prev[index] }));

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem',
      marginBottom: '1rem',
      width: '100%',
    },
    item: {
      position: 'relative' as const,
      border: 'none',
      borderRadius: '0.375rem',
      overflow: 'hidden',
      width: '100%',
      boxShadow: '0 0 4px rgba(0,0,0,0.05)',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      width: '100%',
      backgroundColor: '#f8f8f8',
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
    body: {
      padding: '1rem',
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '1rem',
      width: '100%',
      flexGrow: 1,
    },
    trashButton: {
      position: 'absolute' as const,
      top: '0.25rem',
      right: '0.25rem',
      color: 'red',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontSize: '1rem',
    },
    rotate: (open: boolean) => ({
      transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease',
    }),
  };

  return (
    <div style={styles.container}>
      <div style={{ marginBottom: '0.5rem' }}>
        <h6>{field.label}</h6>
        {field.extra?.helperText && <small className="text-muted">{field.extra.helperText}</small>}
      </div>

      {items.map((item, index) => (
        <div key={index} style={styles.item}>
          <div style={styles.header}>
            <div style={styles.headerLeft} onClick={() => toggleItem(index)}>
              <FontAwesomeIcon icon={faChevronDown} style={styles.rotate(!!openItems[index])} />
              <strong>
                {field.extra?.elementTitle
                  ? `${field.extra.elementTitle} ${index + 1}`
                  : `Элемент ${index + 1}`}
              </strong>
            </div>
            <button style={styles.trashButton} onClick={() => removeItem(index)}>
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
          <Collapse in={!!openItems[index]} unmountOnExit>
            <div style={styles.body}>
              <Row className="gx-3" style={{ width: '100%', margin: 0 }}>
                {item.map((f) => (
                  <Col
                    key={f.name}
                    md={f.extra?.ui?.col ?? 12} 
                  >
                    {f.extra?.beforeField}

                    {UnifiedFieldRegistry.renderAny(f, (v) => updateItemValue(index, f, v))}
                  </Col>
                ))}
              </Row>
            </div>
          </Collapse>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'start', marginTop: '1rem' }}>
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
