import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import type { ComponentType, LazyExoticComponent, ReactNode } from "react";
import { GuardComponent } from "./guards/types";

export interface RouteConfig {
  id: string;
  path: string;
  component?: LazyExoticComponent<ComponentType<any>> | ComponentType<any>;
  layout?: ComponentType<{ children: ReactNode }> | LazyExoticComponent<ComponentType<{ children: ReactNode }>>;
  guard?: GuardComponent;
  meta?: {
    label?: string;
    roles?: string[];
    permissions?: string[];
    icon?: IconDefinition;
    showInMenu?: boolean;
  };
  children?: RouteConfig[];
}

export interface RouteGroup {
  name: string;
  routes: RouteConfig[];
}