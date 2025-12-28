import { createBrowserRouter } from 'react-router-dom';
import { routeConfigs } from './config/routes';
import { buildRouterConfig } from './utils/routerBuilder';

export const router = createBrowserRouter(buildRouterConfig(routeConfigs));