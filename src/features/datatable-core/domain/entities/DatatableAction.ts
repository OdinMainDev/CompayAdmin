import type { FormSchema } from '../ports/IDatatableFormBuilder';
import type { DatatableState } from './DatatableState';

export interface DatatableAction<T = unknown> {
  id: string;
  label: string;
  type: 'button' | 'dropdown' | 'form';
  variant: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'outline';
  icon?: React.ReactNode;
  position: 'header' | 'row' | 'bulk' | 'toolbar';
  form?: FormSchema;
  handler: (context: ActionContext<T>) => void | Promise<void>;
  visible?: (context: ActionContext<T>) => boolean;
  disabled?: (context: ActionContext<T>) => boolean;
  confirm?: {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
  };
  requiresSelection?: boolean;
  requiresSingleSelection?: boolean;
  permission?: string;
}

export interface ActionContext<T = unknown> {
  selectedRows: T[];
  currentRow?: T;
  datatableState: DatatableState<T>;
  formData?: Record<string, unknown>;
}