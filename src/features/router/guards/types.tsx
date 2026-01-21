import { ReactNode } from "react";

export interface GuardProps {
    children: ReactNode;
}

export type GuardComponent = React.ComponentType<GuardProps>;