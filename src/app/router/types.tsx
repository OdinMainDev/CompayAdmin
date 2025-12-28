import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import type { ComponentType, LazyExoticComponent, ReactNode } from "react";
import type { GuardComponent } from "./guards/RoleGuard";

export interface RouteConfig {
  id: string;
  path: string;
  component: LazyExoticComponent<ComponentType<any>> | ComponentType<any>;
  layout?: ComponentType<{ children: ReactNode }> | LazyExoticComponent<ComponentType<{ children: ReactNode }>>;
  guard?: GuardComponent;
  meta?: {
    label: string;
    roles?: string[];
    permissions?: string[];
    icon?: IconDefinition;
  };
  children?: RouteConfig[];
}

export interface RouteGroup {
  name: string;
  routes: RouteConfig[];
}