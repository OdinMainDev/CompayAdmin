import { faGaugeHigh, faTableList, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import DashboardOverview from '../pages/dashboard/Overview';
import DatatableDemo from '../pages/tools/DatatableDemo';
import FormBuilderDemo from '../pages/tools/FormBuilderDemo';
import { type RouteGroup } from './routes';

export const devRoutes: RouteGroup[] = [
  {
    label: 'Dev',
    pages: [
      {
        name: 'dev-dashboard',
        label: 'Dashboard',
        path: 'dashboard',
        icon: faGaugeHigh,
        element: <DashboardOverview />,
      },
    ],
  },
  {
    label: 'Инструменты',
    pages: [
      {
        name: 'dev-datatable',
        label: 'Datatable',
        path: 'dev/datatable',
        icon: faTableList,
        element: <DatatableDemo />,
      },
      {
        name: 'dev-form-builder',
        label: 'Form Builder',
        path: 'dev/form-builder',
        icon: faWandMagicSparkles,
        element: <FormBuilderDemo />,
      },
    ],
  },
];
