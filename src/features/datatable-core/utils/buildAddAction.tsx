import { QuickAction } from '../domain/entities/QuickAction';
import type { NavigateFunction } from 'react-router-dom';

export function buildAddAction(
  title: string,
  link: string,
  navigate: NavigateFunction
): QuickAction {
  return {
    id: 'add',
    label: title,
    icon: <i className="fas fa-plus" />,
    variant: 'primary',
    handler: () => navigate(link),
  };
}
