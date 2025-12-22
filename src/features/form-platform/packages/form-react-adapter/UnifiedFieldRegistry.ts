import React from 'react';
import type { BaseFieldExtra } from '../form-core/domain/extra/BaseFieldExtra';
import type { IField } from '../form-core/domain/field/IField';

export type FieldConstructor<T,E extends BaseFieldExtra = BaseFieldExtra> = {
  new (key: string, label: string, value: T, extra?: E): IField<T, E>;
  fromJson?: (json: { key: string; label: string; defaultValue?: T; extra?: E }) => IField<T, E>;
};
export type Renderer<
  T,
  E extends BaseFieldExtra = BaseFieldExtra
> = React.FC<{
  field: IField<T, E>;
  onChange: (value: T) => void;
}>;


interface FieldEntry<T,E extends BaseFieldExtra = BaseFieldExtra> {
  ctor: FieldConstructor<T, E>;
  renderer: Renderer<T, E>;
}

export class UnifiedFieldRegistry {
  private static registry = new Map<string, FieldEntry<any, any>>();

  static create<T,E extends BaseFieldExtra = BaseFieldExtra>(
    type: string,
    key: string,
    label: string,
    value: T,
    extra?: E
  ): IField<T, E> {
    const entry = this.registry.get(type) as FieldEntry<T, E> | undefined;
    if (!entry) throw new Error(`Field type "${type}" is not registered`);
    return new entry.ctor(key, label, value, extra);
  }

  static createFromJson<T,E extends BaseFieldExtra = BaseFieldExtra>(
    json: { type: string; key: string; label: string; defaultValue?: T; options?: E },
    currentValues?: Record<string, unknown>
  ): IField<T, E> {
    const entry = this.registry.get(json.type) as FieldEntry<T, E> | undefined;
    if (!entry) throw new Error(`Field type "${json.type}" is not registered`);

    const field = entry.ctor.fromJson
      ? entry.ctor.fromJson(json)
      : new entry.ctor(
          json.key,
          json.label,
          json.defaultValue as T,
          json.options
        );

    if (currentValues && currentValues[json.key] !== undefined) {
      field.value = currentValues[json.key] as T;
    }

    return field;
  }

  static render<T, E extends BaseFieldExtra>(
    field: IField<T, E>,
    onChange: (value: T) => void
  ): React.ReactElement {
    const entry = this.registry.get(field.type) as FieldEntry<T, E> | undefined;
  
    if (!entry) throw new Error(`Renderer for type "${field.type}" not found`);
  
    const element = React.createElement(
      entry.renderer,
      {
        field,
        onChange
      }
    );
  
    return element;
  }
  static registerFunction<T, E extends BaseFieldExtra = BaseFieldExtra>(
    type: string,
    ctor: FieldConstructor<T, E>,
    renderFunction: (field: IField<T, E>, onChange: (value: T) => void) => React.ReactElement
  ) {
    const renderer: React.FC<{ field: IField<T, E>; onChange: (value: T) => void }> = 
      (props) => renderFunction(props.field, props.onChange);
    
    this.registry.set(type, { ctor, renderer });
  }

  static registerComponent<T, E extends BaseFieldExtra = BaseFieldExtra>(
    type: string,
    ctor: FieldConstructor<T, E>,
    component: React.FC<{ field: IField<T, E>; onChange: (value: T) => void }>
  ) {
    this.registry.set(type, { ctor, renderer: component });
  }

  static register<T, E extends BaseFieldExtra = BaseFieldExtra>(
    type: string,
    ctor: FieldConstructor<T, E>,
    renderer: Renderer<T, E>
  ) {
    if (renderer.length === 2) {
      this.registerFunction(type, ctor, renderer as any);
    } else {
      this.registerComponent(type, ctor, renderer as any);
    }
  }
}
