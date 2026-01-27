import React from 'react';

interface CopyInputProps {
  value: boolean;
}

export function RenderBool({ value }: CopyInputProps) {
  return <h6>{value ? '✅' : '❌'}</h6>;
}
