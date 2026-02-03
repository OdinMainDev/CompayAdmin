import { RowAction } from '../domain/entities/RowAction';
import { Entity } from '@/app/entities/entity';
import { t } from 'i18next';
import { ApiError } from '@/features/api-client/types/core';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function buildDeleteAction<T extends Entity>(
  deleteFn: (id: number) => Promise<{ success: boolean; message?: string } | ApiError>,
  onSuccess?: () => void,
): RowAction<T> & { handler: (params: { currentRow?: T }) => void } {
  return {
    id: 'delete',
    label: '',
    icon: <FontAwesomeIcon icon={faTrashCan} />,
    variant: 'danger',
    confirm: {
      title: t('datatable_demo.confirm.delete_title'),
      message: t('datatable_demo.confirm.delete_message'),
      confirmText: t('datatable_demo.confirm.delete_confirm'),
      cancelText: t('datatable_demo.confirm.delete_cancel'),
    },
    handler: ({ currentRow }: { currentRow?: T }) => {
      if (!currentRow?.id) return;

      const confirmed = window.confirm(
        `${t('datatable_demo.confirm.delete_title')}\n${t('datatable_demo.confirm.delete_message')}`,
      );
      if (!confirmed) return;

      const run = async () => {
        try {
          const response = await deleteFn(currentRow.id);
          if ('success' in response && response.success) {
            alert('User deleted successfully');
            onSuccess?.();
          } else {
            alert('Failed to delete user');
          }
        } catch (error) {
          alert('Error deleting user');
          console.error('Delete error:', error);
        }
      };

      void run();
    },
  };
}
