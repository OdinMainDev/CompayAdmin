import { useState, useEffect, useCallback } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ru } from 'date-fns/locale';
import type { IField } from '../../form-core/domain/field/IField';
import type { DaterangeFieldExtra } from '../../form-core/domain/extra/DaterangeFieldExtra';
import { useTranslation } from 'react-i18next';

const timestampToDate = (timestamp: number | undefined | null): Date | null => {
  if (!timestamp) return null;
  return new Date(timestamp * 1000);
};

const dateToTimestamp = (date: Date | null): number | null => {
  if (!date) return null;
  return Math.floor(date.getTime() / 1000);
};

export const DaterangeRenderer = (
  field: IField<{ from?: number | null; to?: number | null }, DaterangeFieldExtra>,
  onChange: (value: { from?: number | null; to?: number | null }) => void
) => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [isValidRange, setIsValidRange] = useState(true);
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'ru' ? 'ru-RU' : 'en-US';

  useEffect(() => {
    setFromDate(timestampToDate(field.value?.from));
    setToDate(timestampToDate(field.value?.to));
  }, [field.value?.from, field.value?.to]);

  useEffect(() => {
    if (fromDate && toDate && fromDate > toDate) {
      setIsValidRange(false);
    } else {
      setIsValidRange(true);
    }
  }, [fromDate, toDate]);

  const handleFromChange = useCallback((date: Date | null) => {
    setFromDate(date);
    const newValue = {
      from: dateToTimestamp(date),
      to: field.value?.to
    };
    onChange(newValue);
  }, [field.value?.to, onChange]);

  const handleToChange = useCallback((date: Date | null) => {
    setToDate(date);
    const newValue = {
      from: field.value?.from,
      to: dateToTimestamp(date)
    };
    onChange(newValue);
  }, [field.value?.from, onChange]);

  const handleClearFrom = useCallback(() => {
    setFromDate(null);
    const newValue = {
      from: null,
      to: field.value?.to
    };
    onChange(newValue);
  }, [field.value?.to, onChange]);

  const handleClearTo = useCallback(() => {
    setToDate(null);
    const newValue = {
      from: field.value?.from,
      to: null
    };
    onChange(newValue);
  }, [field.value?.from, onChange]);

  const handleClearAll = useCallback(() => {
    setFromDate(null);
    setToDate(null);
    onChange({ from: null, to: null });
  }, [onChange]);

  const quickPeriods = [
    { label: 'Сегодня', getDates: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return { 
        from: dateToTimestamp(today), 
        to: dateToTimestamp(tomorrow) 
      };
    }},
    { label: 'Вчера', getDates: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return { 
        from: dateToTimestamp(yesterday), 
        to: dateToTimestamp(today) 
      };
    }},
    { label: 'Эта неделя', getDates: () => {
      const now = new Date();
      const firstDay = new Date(now);
      firstDay.setDate(now.getDate() - now.getDay() + 1);
      firstDay.setHours(0, 0, 0, 0);
      const lastDay = new Date(firstDay);
      lastDay.setDate(lastDay.getDate() + 7);
      return { 
        from: dateToTimestamp(firstDay), 
        to: dateToTimestamp(lastDay) 
      };
    }},
    { label: 'Этот месяц', getDates: () => {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return { 
        from: dateToTimestamp(firstDay), 
        to: dateToTimestamp(lastDay) 
      };
    }}
  ];

  const handleQuickPeriod = useCallback((getDates: () => { from: number | null; to: number | null }) => {
    const dates = getDates();
    setFromDate(timestampToDate(dates.from));
    setToDate(timestampToDate(dates.to));
    onChange({
      from: dates.from,
      to: dates.to
    });
  }, [onChange]);

  const dateFormat = field.extra?.dateFormat || 'dd.MM.yyyy';
  const placeholderFrom = field.extra?.placeholderFrom || 'С даты';
  const placeholderTo = field.extra?.placeholderTo || 'По дату';

  return (
    <div className="mt-3">
      {field.label && (
        <Form.Label className="fw-semibold d-flex align-items-center justify-content-between">
          {field.label}
          {(fromDate || toDate) && (
            <button
              type="button"
              className="btn btn-sm btn-link text-decoration-none p-0"
              onClick={handleClearAll}
              disabled={field.extra?.disabled}
            >
              <small>Очистить</small>
            </button>
          )}
        </Form.Label>
      )}

      {field.extra?.showQuickPeriods !== false && (
        <div className="mb-3 d-flex flex-wrap gap-2">
          {quickPeriods.map((period, index) => (
            <button
              key={index}
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => handleQuickPeriod(period.getDates)}
              disabled={field.extra?.disabled}
            >
              {period.label}
            </button>
          ))}
        </div>
      )}

      <div className="d-flex align-items-start gap-3">
        <div className="flex-grow-1">
          <Form.Label className="small text-muted mb-1">С</Form.Label>
          <div className="position-relative">
            <DatePicker
              selected={fromDate}
              onChange={handleFromChange}
              selectsStart
              startDate={fromDate}
              endDate={toDate}
              maxDate={toDate || undefined}
              dateFormat={dateFormat}
              placeholderText={placeholderFrom}
              isClearable
              showYearDropdown
              yearDropdownItemNumber={10}
              scrollableYearDropdown
              locale={ru}
              className="form-control"
              wrapperClassName="w-100"
              disabled={field.extra?.disabled}
            />
            <div className="position-absolute end-0 top-50 translate-middle-y me-3 d-flex gap-1">
              {fromDate && (
                <button
                  type="button"
                  className="btn btn-sm p-0 border-0"
                  onClick={handleClearFrom}
                  disabled={field.extra?.disabled}
                  style={{ color: '#6c757d' }}
                >
                  <i className="bi bi-x" />
                </button>
              )}
              <i className="bi bi-calendar" style={{ color: '#6c757d' }} />
            </div>
          </div>
        </div>

        <div className="text-muted mt-4">—</div>

        <div className="flex-grow-1">
          <Form.Label className="small text-muted mb-1">По</Form.Label>
          <div className="position-relative">
            <DatePicker
              selected={toDate}
              onChange={handleToChange}
              selectsEnd
              startDate={fromDate}
              endDate={toDate}
              minDate={fromDate || undefined}
              dateFormat={dateFormat}
              placeholderText={placeholderTo}
              isClearable
              showYearDropdown
              yearDropdownItemNumber={10}
              scrollableYearDropdown
              locale={ru}
              className="form-control"
              wrapperClassName="w-100"
              disabled={field.extra?.disabled}
            />
            <div className="position-absolute end-0 top-50 translate-middle-y me-3 d-flex gap-1">
              {toDate && (
                <button
                  type="button"
                  className="btn btn-sm p-0 border-0"
                  onClick={handleClearTo}
                  disabled={field.extra?.disabled}
                  style={{ color: '#6c757d' }}
                >
                  <i className="bi bi-x" />
                </button>
              )}
              <i className="bi bi-calendar" style={{ color: '#6c757d' }} />
            </div>
          </div>
        </div>
      </div>

      {!isValidRange && (
        <div className="invalid-feedback d-block mt-1">
          Дата "с" не может быть позже даты "по"
        </div>
      )}

      {(fromDate || toDate) && (
        <div className="mt-2 small">
          <span className="text-muted">Выбрано: </span>
          <span className="badge bg-light text-dark border">
            {fromDate ? fromDate.toLocaleDateString(locale) : '∞'}
            {' → '}
            {toDate ? toDate.toLocaleDateString(locale) : '∞'}
          </span>
        </div>
      )}

      {field.extra?.helperText && (
        <Form.Text className="text-muted">
          {field.extra.helperText}
        </Form.Text>
      )}
    </div>
  );
};

export const DaterangeFieldRenderer = DaterangeRenderer;