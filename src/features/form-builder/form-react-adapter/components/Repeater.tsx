import { Button, Col, Row } from 'react-bootstrap';
import { UnifiedFieldRegistry } from '../UnifiedFieldRegistry';
import type { IField } from '../../form-core/domain/field/IField';
import type {
  RepeaterFieldExtra,
  RepeaterFieldValue,
} from '../../form-core/domain/field/RepeaterField';
import { faTrashCan, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';



export const RepeaterRenderer = (
  field: IField<RepeaterFieldValue, RepeaterFieldExtra>,
  onChange: (value: RepeaterFieldValue) => void,
) => {
  if (!field.value || field.value.length === 0) {
    const firstItem = (field.extra?.elements ?? []).reduce<Record<string, unknown>>((acc, f) => {
     acc[f.name] = '';
      return acc;
    }, {});
    field.value = [firstItem];
  }
  const elements = field.extra?.elements ?? [];
  const minItems = field.extra?.minItems ?? 0;
  const maxItems = field.extra?.maxItems ?? Infinity;

  const addItem = () => {
    if (!field.value || field.value.length >= maxItems) return;
    const newItem = elements.reduce<Record<string, unknown>>((acc, f) => {
      acc[f.name] = '';
      return acc;
    }, {});
    onChange([...(field.value || []), newItem]);
  };

  const removeItem = (index: number) => {
    if (!field.value || field.value.length <= minItems) return;
    const nextValue = field.value.filter((_, i) => i !== index);
    onChange(nextValue);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (!field.value) return;
    const newValue = [...field.value];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newValue.length) return;

    [newValue[index], newValue[targetIndex]] = [newValue[targetIndex], newValue[index]];
    onChange(newValue);
  };

  const updateItemValue = (index: number, name: string, value: unknown) => {
    const current = Array.isArray(field.value) ? [...field.value] : [];

    if (!current[index]) {
      current[index] = { [name]: value };
    } else {
      current[index] = {
        ...current[index],
        [name]: value,
      };
    }

    onChange(current);
  };

  const [openItems, setOpenItems] = useState<Record<number, boolean>>(() => {
    const obj: Record<number, boolean> = {};
    const length = (field.value && field.value.length) || 1;
    for (let i = 0; i < length; i++) obj[i] = true;
    return obj;
  });
  useEffect(() => {
    if (!field.value) return;

    setOpenItems((prev) => {
      const next: Record<number, boolean> = {};

      field.value.forEach((_, index) => {
        next[index] = prev[index] ?? true;
      });

      return next;
    });
  }, [field.value?.length]);

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
        <div
          key={index}
          style={{
            position: 'relative',
            borderRadius: '0.375rem',
            boxShadow: '0 0 4px rgba(0,0,0,0.05)',
          }}
        >
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
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => toggleItem(index)}
            >
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

            <div style={{ display: 'flex', gap: '0.25rem', position: 'absolute', top: '0.25rem', right: '0.25rem' }}>
              <button
                type="button"
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#555' }}
                onClick={() => moveItem(index, 'up')}
                disabled={index === 0}
              >
                <FontAwesomeIcon icon={faArrowUp} />
              </button>
              <button
                type="button"
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#555' }}
                onClick={() => moveItem(index, 'down')}
                disabled={index === (field.value?.length ?? 1) - 1}
              >
                <FontAwesomeIcon icon={faArrowDown} />
              </button>

              {(!minItems || (field.value && field.value.length > minItems)) && (
                <button
                  type="button"
                  style={{ color: 'red', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1rem' }}
                  onClick={() => removeItem(index)}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              )}
            </div>
          </div>

          <AnimatePresence initial={false}>
            {openItems[index] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                style={{ overflow: 'hidden', width: '100%' }}
              >
                <div style={{ padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
                  <Row className="gx-3" style={{ width: '100%', margin: 0 }}>
                    {elements.map((f) => {
                      const value = itemValue[f.name];
                      const copy = Object.create(Object.getPrototypeOf(f)) as typeof f;
                      Object.assign(copy, f);
                      copy.value = value as typeof copy.value;
                      copy.extra = copy.extra ? { ...copy.extra } : {};

                      const errorsForThisCell = field.extra?.error?.reduce<string[]>((acc, errStr) => {
                        const match = errStr.match(/^([^\[\]]+)\[(\d+)\];(.+)$/);
                        if (!match) return acc;

                        const [, fieldName, idxStr, message] = match;
                        const idx = Number(idxStr);

                        if (fieldName === f.name && idx === index) {
                          acc.push(message);
                        }
                        return acc;
                      }, []);

                      copy.extra.error =
                        errorsForThisCell && errorsForThisCell.length > 0
                          ? errorsForThisCell
                          : undefined;

                      return (
                        <Col key={f.name} md={f.extra?.ui?.col ?? 12}>
                          {f.extra?.beforeField}
                          {UnifiedFieldRegistry.renderAny(copy, (v) => updateItemValue(index, f.name, v))}
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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