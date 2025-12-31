import { Form } from 'react-bootstrap';
import type { IField } from '../../form-core/domain/field/IField';
import type { BaseFieldExtra } from '../../form-core/domain/extra/BaseFieldExtra';
import { useState, useEffect } from 'react';

export const OptionalSwitchRenderer = (
  field: IField<boolean | null, BaseFieldExtra>,
  onChange: (value: boolean | null) => void
) => {
  const [internalValue, setInternalValue] = useState<'null' | 'true' | 'false'>(
    field.value === true ? 'true' : field.value === false ? 'false' : 'null'
  );

  useEffect(() => {
    setInternalValue(
      field.value === true ? 'true' : field.value === false ? 'false' : 'null'
    );
  }, [field.value]);

  const handleToggle = () => {
    let nextValue: boolean | null;
    let nextState: 'null' | 'true' | 'false';

    if (internalValue === 'null') {
      nextValue = true;
      nextState = 'true';
    } else if (internalValue === 'true') {
      nextValue = false;
      nextState = 'false';
    } else {
      nextValue = null;
      nextState = 'null';
    }

    setInternalValue(nextState);
    onChange(nextValue);
  };

  return (
    <div className="mt-3 d-flex align-items-center">
      <div 
        className="position-relative me-3"
        style={{
          width: '80px', 
          height: '26px',
          borderRadius: '13px',
          backgroundColor: '#e9ecef',
          border: '1px solid #dee2e6',
          cursor: field.extra?.disabled ? 'not-allowed' : 'pointer',
          opacity: field.extra?.disabled ? 0.6 : 1,
          overflow: 'hidden'
        }}
        onClick={field.extra?.disabled ? undefined : handleToggle}
      >
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '33.33%',
            height: '100%',
            backgroundColor: internalValue === 'null' ? '#6c757d' : 'transparent',
            transition: 'background-color 0.2s'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: '33.33%',
            width: '33.33%',
            height: '100%',
            backgroundColor: internalValue === 'true' ? '#198754' : 'transparent',
            transition: 'background-color 0.2s'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: '66.66%',
            width: '33.33%',
            height: '100%',
            backgroundColor: internalValue === 'false' ? '#dc3545' : 'transparent',
            transition: 'background-color 0.2s'
          }}
        />
        
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: '33.33%',
            width: '1px',
            height: '100%',
            backgroundColor: '#adb5bd'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: '66.66%',
            width: '1px',
            height: '100%',
            backgroundColor: '#adb5bd'
          }}
        />
        
        <div 
          style={{
            position: 'absolute',
            top: '2px',
            left: internalValue === 'null' ? '2px' : 
                  internalValue === 'true' ? '28px' : '54px',
            width: '22px',
            height: '22px',
            backgroundColor: '#fff',
            borderRadius: '11px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'left 0.2s',
            zIndex: 2
          }}
        />
      </div>

      <div className="d-flex align-items-center">
        <label 
          className="form-check-label"
          style={{ cursor: field.extra?.disabled ? 'not-allowed' : 'pointer' }}
          onClick={field.extra?.disabled ? undefined : handleToggle}
        >
          {field.label}
        </label>
        {internalValue === 'null' && (
          <span className="badge bg-secondary ms-2">All</span>
        )}
      </div>

      <Form.Check
        type="switch"
        id={`optional-switch-${field.name}`}
        className="visually-hidden"
        checked={internalValue === 'true'}
        onChange={handleToggle}
        disabled={field.extra?.disabled}
      />
    </div>
  );
};