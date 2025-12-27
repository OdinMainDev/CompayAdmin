import { faGaugeHigh, faTableList, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import DashboardOverview from '../../pages/dashboard/Overview';
import DatatableDemo from '../../pages/tools/DatatableDemo';
import FormBuilderDemo from '../../pages/tools/FormBuilderDemo';
import { type RouteGroup } from './routes';

export const merchantRoutes: RouteGroup[] = [
  {
    label: 'routes.merchant',
    pages: [
      {
        name: 'merchant-dashboard',
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
        name: 'merchant-datatable',
        label: 'routes.datatable',
        path: 'merchant/datatable',
        icon: faTableList,
        element: <DatatableDemo />,
      },
      {
        name: 'merchant-form-builder',
        label: 'routes.form_builder',
        path: 'merchant/form-builder',
        icon: faWandMagicSparkles,
        element: <FormBuilderDemo />,
      },
    ],
  },
];
