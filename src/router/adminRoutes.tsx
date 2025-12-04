import { faChartPie, faClipboardList, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import DashboardOverview from '../pages/dashboard/Overview';
import DatatableDemo from '../pages/tools/DatatableDemo';
import FormBuilderDemo from '../pages/tools/FormBuilderDemo';
import { type RouteGroup } from './routes';

export const adminRoutes: RouteGroup[] = [
  {
    label: 'Admin',
    pages: [
      {
        name: 'admin-dashboard',
        label: 'Dashboard',
        path: 'dashboard',
        icon: faChartPie,
        element: <DashboardOverview />,
      },
    ],
  },
  {
    label: 'Управление',
    pages: [
      {
        name: 'admin-datatable',
        label: 'Таблицы',
        path: 'admin/datatable',
        icon: faClipboardList,
        element: <DatatableDemo />,
      },
      {
        name: 'admin-form-builder',
        label: 'Form Builder',
        path: 'admin/form-builder',
        icon: faScrewdriverWrench,
        element: <FormBuilderDemo />,
      },
    ],
  },
];
