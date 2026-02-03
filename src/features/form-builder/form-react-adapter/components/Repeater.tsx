import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashCan,
  faChevronDown,
  faArrowUp,
  faArrowDown,
} from '@fortawesome/free-solid-svg-icons';

import { UnifiedFieldRegistry } from '../UnifiedFieldRegistry';
import type { IField } from '../../form-core/domain/field/IField';
import type {
  RepeaterFieldExtra,
  RepeaterFieldValue,
} from '../../form-core/domain/field/RepeaterField';
import type { AnyField } from '../fields';

const CELL_ERROR_RE = /^([^\][]+)\[(\d+)\];(.+)$/;

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

  const elements: AnyField[] = field.extra?.elements ?? [];
  const minItems = field.extra?.minItems ?? 0;
  const maxItems = field.extra?.maxItems ?? Infinity;

  const addItem = () => {
    if (!field.value || field.value.length >= maxItems) return;

    const newItem = elements.reduce<Record<string, unknown>>((acc, f) => {
      acc[f.name] = '';
      return acc;
    }, {});

    onChange([...field.value, newItem]);
  };

  const removeItem = (index: number) => {
    if (!field.value || field.value.length <= minItems) return;
    onChange(field.value.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (!field.value) return;

    const next = [...field.value];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= next.length) return;

    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onChange(next);
  };

  const updateItemValue = (index: number, name: string, value: unknown) => {
    const next = [...(field.value ?? [])];

    next[index] = {
      ...(next[index] ?? {}),
      [name]: value,
    };

    onChange(next);
  };

  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!field.value) return;

    setOpenItems((prev) => {
      const next: Record<number, boolean> = {};
      field.value.forEach((_, index) => {
        next[index] = prev[index] ?? true;
      });
      return next;
    });
  }, [field.value]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const hasGlobalError = Boolean(field.extra?.error?.some((err) => !CELL_ERROR_RE.test(err)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <h6>{field.label}</h6>
        {field.extra?.helperText && <small className="text-muted">{field.extra.helperText}</small>}
      </div>

      {(field.value ?? []).map((itemValue, index) => (
        <div
          key={index}
          style={{
            position: 'relative',
            borderRadius: '0.375rem',
            border: hasGlobalError ? '1px solid #dc3545' : undefined,
            boxShadow: hasGlobalError
              ? '0 0 0 0.2rem rgba(220, 53, 69, 0.25)'
              : '0 0 4px rgba(0,0,0,0.05)',
            padding: hasGlobalError ? '0.75rem' : undefined,
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

            <div
              style={{
                display: 'flex',
                gap: '0.25rem',
                position: 'absolute',
                top: '0.25rem',
                right: '0.25rem',
              }}
            >
              <button
                type="button"
                onClick={() => moveItem(index, 'up')}
                disabled={index === 0}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <FontAwesomeIcon icon={faArrowUp} />
              </button>

              <button
                type="button"
                onClick={() => moveItem(index, 'down')}
                disabled={index === (field.value?.length ?? 1) - 1}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <FontAwesomeIcon icon={faArrowDown} />
              </button>

              {field.value && field.value.length > minItems && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'red',
                  }}
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
                style={{ overflow: 'hidden' }}
              >
                <div style={{ padding: '1rem' }}>
                  <Row className="gx-3">
                    {elements.map((f) => {
                      const value = itemValue[f.name];
                      const prototype = Object.getPrototypeOf(f) as object | null;
                      const copy = Object.assign(Object.create(prototype), f) as AnyField;
                      copy.value = value;
                      copy.extra = copy.extra ? { ...copy.extra } : {};
                      const errorsForCell = field.extra?.error?.reduce<string[]>((acc, errStr) => {
                        const match = CELL_ERROR_RE.exec(errStr);
                        if (!match) return acc;

                        const [, fieldName, idxStr, message] = match;
                        if (fieldName === f.name && Number(idxStr) === index) {
                          acc.push(message);
                        }
                        return acc;
                      }, []);

                      copy.extra.error =
                        errorsForCell && errorsForCell.length ? errorsForCell : undefined;

                      return (
                        <Col key={f.name} md={f.extra?.ui?.col ?? 12}>
                          {UnifiedFieldRegistry.renderAny(copy, (v) =>
                            updateItemValue(index, f.name, v),
                          )}
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

      {field.extra?.error
        ?.filter((e) => !CELL_ERROR_RE.test(e))
        .map((e, i) => (
          <div key={i} style={{ color: '#dc3545', fontSize: '0.875rem' }}>
            {e}
          </div>
        ))}

      <div style={{ marginTop: '1rem' }}>
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
