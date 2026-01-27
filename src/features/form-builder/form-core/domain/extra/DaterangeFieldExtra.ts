import type { BaseFieldExtra } from './BaseFieldExtra';

export interface DaterangeFieldExtra extends BaseFieldExtra {
  from?: number;
  to?: number;

  placeholderFrom?: string;
  placeholderTo?: string;
  dateFormat?: string;
  showQuickPeriods?: boolean;
  showClearButton?: boolean;

  minDate?: number;
  maxDate?: number;
}
