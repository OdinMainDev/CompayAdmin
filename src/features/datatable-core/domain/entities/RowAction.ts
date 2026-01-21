
export interface RowAction<T> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'warning' | 'info';
  position?: 'row' | 'dropdown';
  visible?: boolean;
  handler: (params: { currentRow?: T }) => void;

  confirm?: {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
  };
  hidden?: boolean | ((row: T) => boolean);
}