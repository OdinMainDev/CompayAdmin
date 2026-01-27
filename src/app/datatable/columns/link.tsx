import React, {  } from "react";
import { useTranslation } from "react-i18next";

interface CopyInputProps {
    path: string;
    text?: string;
}

export function RenderLink({ path, text }: CopyInputProps) {
    const { t } = useTranslation("panel");
    return (
        <p><a href={path}>{text ? text : t("datatable.go_to")}</a></p>
    );
}
