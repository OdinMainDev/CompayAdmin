import { useMemo } from 'react';
import { routeConfigs } from '@/app/router/Routes';
import { RouteConfig } from '@/features/router/types';
import { useAuthContext } from '@/features/auth/auth-context';

export const getDashboardRoutes = (configs: RouteConfig[]) =>
  configs.find((config) => config.id.includes('layout-panel'));

const filterRoutesRecursive = (routes: RouteConfig[], role?: string): RouteConfig[] => {
  return routes.reduce<RouteConfig[]>((acc, route) => {
    const roleAllowed = !!route.meta?.roles && role && route.meta.roles.includes(role);

    const showInMenu = route.meta?.showInMenu === true;

    const filteredChildren = route.children ? filterRoutesRecursive(route.children, role) : [];

    if ((roleAllowed && showInMenu) || filteredChildren.length > 0) {
      acc.push({
        ...route,
        children: filteredChildren.length ? filteredChildren : undefined,
      });
    }

    return acc;
  }, []);
};

export const useGetAvailMenuRoutes = () => {
  const { getRole } = useAuthContext();
  const role = getRole();

  return useMemo(() => {
    const panelConfig = getDashboardRoutes(routeConfigs);
    if (!panelConfig || !panelConfig.children) return null;

    const filteredChildren = filterRoutesRecursive(panelConfig.children, role ?? '');

    if (!filteredChildren.length) return null;

    return {
      ...panelConfig,
      children: filteredChildren,
    };
  }, [role]);
};
