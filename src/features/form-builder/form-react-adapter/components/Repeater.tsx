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
import React, { useEffect, useState } from 'react';

export const RepeaterRenderer = (
  field: IField<RepeaterFieldValue, RepeaterFieldExtra>,
  onChange: (value: RepeaterFieldValue) => void,
) => {
  const elements = field.extra?.elements ?? [];
  const minItems = field.extra?.minItems ?? 0;
  const maxItems = field.extra?.maxItems ?? Infinity;

  const addItem = () => {
    if (!field.value || field.value.length >= maxItems) return;
    const newItem = elements.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {} as any);
    onChange([...(field.value || []), newItem]);
  };

  const removeItem = (index: number) => {
    if (!field.value || field.value.length <= minItems) return;
    const nextValue = field.value.filter((_, i) => i !== index);
    onChange(nextValue);
  };

  const updateItemValue = (index: number, name: string, value: any) => {
    if (!field.value) return;
    const nextValue = field.value.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    onChange(nextValue);
  };

  const [openItems, setOpenItems] = useState<Record<number, boolean>>(() => {
    const obj: Record<number, boolean> = {};
    const length = (field.value && field.value.length) || 1; 
    for (let i = 0; i < length; i++) obj[i] = true;
    return obj;
  });

  useEffect(() => {
    setOpenItems((prev) => {
      const next: Record<number, boolean> = { ...prev };
      const length = field.value?.length ?? 0;
      for (let i = 0; i < length; i++) {
        if (next[i] === undefined) {
          next[i] = true;
        }
      }
      return next;
    });
  }, [field.value]);
  

  const toggleItem = (index: number) =>
    setOpenItems((prev) => ({ ...prev, [index]: !prev[index] }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <h6>{field.label}</h6>
        {field.extra?.helperText && <small className="text-muted">{field.extra.helperText}</small>}
      </div>

      {(field.value && field.value.length ? field.value : [{}]).map((itemValue, index) => (
        <div key={index} style={{ position: 'relative', borderRadius: '0.375rem', boxShadow: '0 0 4px rgba(0,0,0,0.05)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              backgroundColor: '#f8f8f8',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => toggleItem(index)}>
              <FontAwesomeIcon
                icon={faChevronDown}
                style={{
                  transform: openItems[index] ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
              <strong>
                {field.extra?.elementTitle
                  ? `${field.extra.elementTitle} ${index + 1}`
                  : `Элемент ${index + 1}`}
              </strong>
            </div>
            {(!minItems || (field.value && field.value.length > minItems)) && (
              <button
                type="button" 
                style={{
                  position: 'absolute',
                  top: '0.25rem',
                  right: '0.25rem',
                  color: 'red',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
                onClick={() => removeItem(index)}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            )}
          </div>

          <Collapse in={!!openItems[index]} unmountOnExit>
            <div style={{ padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
              <Row className="gx-3" style={{ width: '100%', margin: 0 }}>
                {elements.map((f) => {
                  const value = itemValue[f.name];
                    const copy = Object.create(Object.getPrototypeOf(f)) as typeof f;
                    Object.assign(copy, f);
                    copy.value = value as typeof copy.value;


                  return (
                    <Col key={f.name} md={f.extra?.ui?.col ?? 12}>
                      {f.extra?.beforeField}
                      {UnifiedFieldRegistry.renderAny(copy, (v) => updateItemValue(index, f.name, v))}
                    </Col>
                  );
                })}
              </Row>
            </div>
          </Collapse>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'start', marginTop: '1rem' }}>
        <Button
          variant="outline-primary"
          onClick={addItem}
          disabled={field.value && field.value.length >= maxItems}
        >
          + Добавить элемент
        </Button>
      </div>
    </div>
  );
};

export default RepeaterRenderer;
