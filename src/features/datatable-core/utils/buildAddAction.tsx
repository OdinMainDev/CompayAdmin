import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { QuickAction } from '../domain/entities/QuickAction';
import type { NavigateFunction } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export function buildAddAction(
  title: string,
  link: string,
  navigate: NavigateFunction,
): QuickAction {
  return {
    id: 'add',
    label: title,
    icon: <FontAwesomeIcon icon={faPlus} />,
    variant: 'primary',
    handler: () => navigate(link),
  };
}
