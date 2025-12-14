import { faGaugeHigh, faTableList, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import DashboardOverview from '../pages/dashboard/Overview';
import DatatableDemo from '../pages/tools/DatatableDemo';
import FormBuilderDemo from '../pages/tools/FormBuilderDemo';
import { type RouteGroup } from './routes';

export const devRoutes: RouteGroup[] = [
  {
    label: 'routes.dev',
    pages: [
      {
        name: 'dev-dashboard',
        label: 'routes.dashboard',
        path: 'dashboard',
        icon: faGaugeHigh,
        element: <DashboardOverview />,
      },
    ],
  },
  {
    label: 'routes.tools',
    pages: [
      {
        name: 'dev-datatable',
        label: 'routes.datatable',
        path: 'dev/datatable',
        icon: faTableList,
        element: <DatatableDemo />,
      },
      {
        name: 'dev-form-builder',
        label: 'routes.form_builder',
        path: 'dev/form-builder',
        icon: faWandMagicSparkles,
        element: <FormBuilderDemo />,
      },
    ],
  },
];
