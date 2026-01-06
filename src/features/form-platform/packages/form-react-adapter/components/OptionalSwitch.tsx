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
    <div className="mt-3 flex items-center gap-3">
      {/* Tri-state segmented switch (Tailwind only) */}
      <div
        role="switch"
        aria-checked={internalValue === 'true'}
        aria-disabled={!!field.extra?.disabled}
        tabIndex={field.extra?.disabled ? -1 : 0}
        onClick={field.extra?.disabled ? undefined : handleToggle}
        onKeyDown={(e) => {
          if (field.extra?.disabled) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
        className={[
          'relative select-none',
          'h-7 w-20 rounded-full',
          'border border-slate-300 bg-slate-100',
          'shadow-inner',
          'transition',
          field.extra?.disabled
            ? 'cursor-not-allowed opacity-60'
            : 'cursor-pointer hover:bg-slate-50',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2',
        ].join(' ')}
      >
        {/* active segment highlight */}
        <div
          className={[
            'absolute inset-y-0',
            'w-1/3 rounded-full transition-all duration-200',
            internalValue === 'null'
              ? 'left-0 bg-slate-500/70'
              : internalValue === 'true'
              ? 'left-1/3 bg-emerald-600/80'
              : 'left-2/3 bg-red-600/80',
          ].join(' ')}
        />

        {/* separators */}
        <div className="absolute inset-y-0 left-1/3 w-px bg-slate-300/80" />
        <div className="absolute inset-y-0 left-2/3 w-px bg-slate-300/80" />

        {/* knob */}
      <div
        className={[
          'absolute z-[2]',
          'top-1/2 -translate-y-1/2 -translate-x-1/2',
          'h-[18px] w-[18px] rounded-full bg-white',
          'shadow-md ring-1 ring-black/5',
          'transition-all duration-200',
          internalValue === 'null'
            ? 'left-[16.666%]'
            : internalValue === 'true'
            ? 'left-[50%]'
            : 'left-[83.333%]',
        ].join(' ')}
      />
      </div>

      {/* Label + status */}
      <div className="flex items-center gap-2">
        <label
          className={[
            'text-sm text-slate-800',
            field.extra?.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          ].join(' ')}
          onClick={field.extra?.disabled ? undefined : handleToggle}
        >
          {field.label}
        </label>

        {internalValue === 'null' && (
          <span className="inline-flex items-center rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-700">
            All
          </span>
        )}
        {internalValue === 'true' && (
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
            Yes
          </span>
        )}
        {internalValue === 'false' && (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700">
            No
          </span>
        )}
      </div>

      {/* Hidden native control for forms/compat */}
      <input
        type="checkbox"
        className="sr-only"
        id={`optional-switch-${field.name}`}
        checked={internalValue === 'true'}
        onChange={handleToggle}
        disabled={field.extra?.disabled}
      />
    </div>
  );
};