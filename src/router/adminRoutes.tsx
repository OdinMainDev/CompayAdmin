import { faChartPie, faClipboardList, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import DashboardOverview from '../pages/dashboard/Overview';
import DatatableDemo from '../pages/tools/DatatableDemo';
import FormBuilderDemo from '../pages/tools/FormBuilderDemo';
import { type RouteGroup } from './routes';

export const adminRoutes: RouteGroup[] = [
  {
    label: 'routes.admin',
    pages: [
      {
        name: 'admin-dashboard',
        label: 'routes.dashboard',
        path: 'dashboard',
        icon: faChartPie,
        element: <DashboardOverview />,
      },
    ],
  },
  {
    label: 'routes.management',
    pages: [
      {
        name: 'admin-datatable',
        label: 'routes.tables',
        path: 'admin/datatable',
        icon: faClipboardList,
        element: <DatatableDemo />,
      },
      {
        name: 'admin-form-builder',
        label: 'routes.form_builder',
        path: 'admin/form-builder',
        icon: faScrewdriverWrench,
        element: <FormBuilderDemo />,
      },
    ],
  },
];
