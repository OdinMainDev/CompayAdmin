import { NavigateFunction } from "react-router-dom";
import { RowAction } from "../domain/entities/RowAction";
import { Entity } from "@/app/entities/entity";

export function buildEditAction<T extends Entity>(
    label: string,
    link: string,
    navigate: NavigateFunction
  ): RowAction<T> & { handler: (params: { currentRow?: T }) => void } {
    return {
        id: 'edit',
        label: label,
        icon: <i className="fas fa-edit"></i>,
        variant: 'primary',
        handler: ({ currentRow }: { currentRow?: T }) => {
        if (!currentRow) return;
        navigate(`${link}${currentRow.id}`);
        },
    };
}
  