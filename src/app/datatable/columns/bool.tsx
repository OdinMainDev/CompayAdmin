import React from "react";
import { Badge } from "react-bootstrap";

interface CopyInputProps {
  value: boolean;
}

export function RenderBool({ value }: CopyInputProps) {

  return (
    <h6>{value ? '✅' : '❌'}</h6>
  );
}
