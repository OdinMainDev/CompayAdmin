import type { ReactNode } from 'react';
import type { RouteObject } from 'react-router-dom';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface AppRoute {
  name: string;
  label: string;
  path?: string;
  element?: ReactNode;
  icon?: IconDefinition;
  pages?: AppRoute[];
}

export interface RouteGroup {
  label: string;
  icon?: IconDefinition;
  pages: AppRoute[];
}

const convertRoute = (route: AppRoute): RouteObject => {
  const children = route.pages?.map(convertRoute);

  return {
    path: route.path,
    element: route.element ?? null,
    children,
  };
};

export const buildRouteObjects = (groups: RouteGroup[]): RouteObject[] =>
  groups.flatMap((group) => group.pages.map(convertRoute));
