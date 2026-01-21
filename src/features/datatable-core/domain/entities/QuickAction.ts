import type { RawFormSection } from "../../../form-platform/packages/form-core/domain/field/RawFormSection";

export interface QuickAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'outline';
  position?: 'header' | 'toolbar' | 'inline';

  form?: RawFormSection[]; 
  handler: () => void | Promise<void>;
  shortcut?: string;
  tooltip?: string;
  requiresSelection?: boolean;
  confirm?: QuickActionConfirm;
}

export interface QuickActionContext<T = unknown> {
  selectedIds: string[];
  selectedRows?: T[];
  datatableState: unknown;
}

export interface QuickActionConfirm {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant?: 'danger' | 'warning' | 'info';
}