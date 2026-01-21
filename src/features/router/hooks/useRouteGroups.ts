import { useMemo } from "react";
import { routeConfigs } from "@/app/router/Routes";
import { RouteConfig } from "@/features/router/types";
import { useAuthContext } from "@/features/auth/auth-context";

export const getPanelRoutes = (configs: RouteConfig[]) => {
  return configs.find(config => config.path === '/panel' || config.id.includes('panel'));
};

export const useRouteGroups = () => {
  const { getRole } = useAuthContext();
  const role = getRole();

  return useMemo(() => {
    const panelConfig = getPanelRoutes(routeConfigs);
    if (!panelConfig) return null;

    const filteredPanel = { ...panelConfig };

    if (filteredPanel.children) {
      filteredPanel.children = filteredPanel.children.filter(route => {
        const roleAllowed = !route.meta?.roles || (role && route.meta.roles.includes(role));
        const visibleInMenu = !route.meta?.hideInMenu;
        return roleAllowed && visibleInMenu;
      });

      const filterNestedChildren = (routes: RouteConfig[]): RouteConfig[] => {
        return routes.map(route => {
          const filteredRoute = { ...route };
          if (filteredRoute.children) {
            filteredRoute.children = filterNestedChildren(filteredRoute.children);
          }
          return filteredRoute;
        });
      };

      filteredPanel.children = filterNestedChildren(filteredPanel.children);
    }

    return filteredPanel;
  }, [role]);
};
