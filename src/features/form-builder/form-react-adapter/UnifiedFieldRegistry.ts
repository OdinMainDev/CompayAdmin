import React from 'react';
import type { BaseFieldExtra } from '@/features/form-builder/form-core/domain/extra/BaseFieldExtra';
import type { IField } from '@/features/form-builder/form-core/domain/field/IField';
import { AnyField } from './fields';

export type FieldConstructor<T = unknown, E extends BaseFieldExtra = BaseFieldExtra> = {
  new (key: string, label: string, value: T, extra?: E): IField<T, E>;
};

export type Renderer<T = unknown, E extends BaseFieldExtra = BaseFieldExtra> = React.FC<{
  field: IField<T, E>;
  onChange: (value: T) => void;
}>;

export type RenderFunction<T = unknown, E extends BaseFieldExtra = BaseFieldExtra> = (
  field: IField<T, E>,
  onChange: (value: T) => void,
) => React.ReactElement;

type RendererOrFunction<T = unknown, E extends BaseFieldExtra = BaseFieldExtra> =
  | Renderer<T, E>
  | RenderFunction<T, E>;

interface FieldEntry {
  ctor: FieldConstructor<unknown, BaseFieldExtra>;
  renderer: Renderer<unknown, BaseFieldExtra>;
}

export class UnifiedFieldRegistry {
  private static registry = new Map<string, FieldEntry>();

  static create<T = unknown, E extends BaseFieldExtra = BaseFieldExtra>(
    type: string,
    key: string,
    label: string,
    value: T,
    extra?: E,
  ): IField<T, E> {
    const entry = this.registry.get(type);
    if (!entry) {
      throw new Error(`Field type "${type}" is not registered`);
    }

    const typedCtor = entry.ctor as unknown as FieldConstructor<T, E>;
    return new typedCtor(key, label, value, extra);
  }

  static renderAny(field: AnyField, onChange: (value: unknown) => void): React.ReactElement {
    const entry = this.registry.get(field.type);
    if (!entry) {
      throw new Error(`Renderer for type "${field.type}" not found`);
    }

    const typedRenderer = entry.renderer;

    return React.createElement(typedRenderer, {
      field,
      onChange,
    });
  }

  static registerFunction<T, E extends BaseFieldExtra = BaseFieldExtra>(
    type: string,
    ctor: FieldConstructor<T, E>,
    renderFunction: RenderFunction<T, E>,
  ): void {
    const rendererComponent: Renderer<unknown, BaseFieldExtra> = (props) =>
      renderFunction(props.field as IField<T, E>, props.onChange as (value: T) => void);

    this.registry.set(type, {
      ctor: ctor as unknown as FieldConstructor<unknown, BaseFieldExtra>,
      renderer: rendererComponent,
    });
  }

  static registerComponent<T = unknown, E extends BaseFieldExtra = BaseFieldExtra>(
    type: string,
    ctor: FieldConstructor<T, E>,
    component: Renderer<T, E>,
  ): void {
    this.registry.set(type, {
      ctor: ctor as unknown as FieldConstructor<unknown, BaseFieldExtra>,
      renderer: component as unknown as Renderer<unknown, BaseFieldExtra>,
    });
  }

  static register<T = unknown, E extends BaseFieldExtra = BaseFieldExtra>(
    type: string,
    ctor: FieldConstructor<T, E>,
    rendererOrFunction: RendererOrFunction<T, E>,
  ): void {
    const isFunction = rendererOrFunction.length === 2;

    if (isFunction) {
      this.registerFunction(type, ctor, rendererOrFunction as RenderFunction<T, E>);
    } else {
      this.registerComponent(type, ctor, rendererOrFunction as Renderer<T, E>);
    }
  }

  static getConstructor<T = unknown, E extends BaseFieldExtra = BaseFieldExtra>(
    type: string,
  ): FieldConstructor<T, E> | undefined {
    const entry = this.registry.get(type);
    if (!entry) return undefined;
    return entry.ctor as unknown as FieldConstructor<T, E>;
  }

  static isRegistered(type: string): boolean {
    return this.registry.has(type);
  }

  static getRegisteredTypes(): string[] {
    return Array.from(this.registry.keys());
  }

  static clearRegistry(): void {
    this.registry.clear();
  }
}
