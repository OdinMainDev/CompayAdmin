import { NavigateFunction } from 'react-router-dom';
import { RowAction } from '../domain/entities/RowAction';
import { Entity } from '@/app/entities/entity';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

export function buildEditAction<T extends Entity>(
  link: string,
  navigate: NavigateFunction,
): RowAction<T> & { handler: (params: { currentRow?: T }) => void } {
  return {
    id: 'edit',
    label: '',
    icon: <FontAwesomeIcon icon={faPenToSquare} />,
    variant: 'primary',
    handler: ({ currentRow }: { currentRow?: T }) => {
      if (!currentRow) return;
      navigate(`${link}${currentRow.id}`);
    },
  };
}
