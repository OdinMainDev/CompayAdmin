export interface BulkAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'outline';
  handler: (context: BulkActionContext) => void | Promise<void>;
  confirm?: BulkActionConfirm;
  requiresAllSelected?: boolean;
  requiresMinimum?: number;
  permission?: string;
}

export interface BulkActionContext {
  selectedIds: string[];
  selectedCount: number;
  datatableState: unknown;
}

export interface BulkActionConfirm {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant?: 'danger' | 'warning';
}
