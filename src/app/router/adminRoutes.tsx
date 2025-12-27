import { faChartPie, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import DashboardOverview from '../../pages/dashboard/Overview';
import FormBuilderDemoV2 from '../../pages/tools/FormBuilderDemoV2';
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
        name: 'admin-form-builderv2',
        label: 'routes.form_builder',
        path: 'admin/form-builderv2',
        icon: faScrewdriverWrench,
        element: <FormBuilderDemoV2 />,
      },
    ],
  },
];
