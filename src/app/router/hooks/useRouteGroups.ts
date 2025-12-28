import { useMemo } from "react";
import { useRole } from "../../../auth/useRole";
import type { RouteConfig } from "../types";
import { routeConfigs } from "../config/routes";


export const getPanelRoutes = (configs: RouteConfig[]) => {
  return configs.find(config => config.path === '/panel' || config.id.includes('panel'));
};

export const useRouteGroups = () => {
    const role = useRole();
    
    return useMemo(() => {
        const panelConfig = getPanelRoutes(routeConfigs);
    
        if (!panelConfig) return null;
        
        const filteredPanel = { ...panelConfig };
        
        if (filteredPanel.children) {
          filteredPanel.children = filteredPanel.children.filter(route => {
            if (!route.meta?.roles) return true;
            return role && route.meta.roles.includes(role);
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
  