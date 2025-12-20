import type { IField } from '../form-core/domain/field/IField';
import type { ReactElement } from 'react';

export type FieldConstructor<T, E extends Record<string, any> = {}> = {
  new (key: string, label: string, value: T, extra?: E): IField<T, E>;
  fromJson?: (json: { key: string; label: string; defaultValue?: T; extra?: E }) => IField<T, E>;
};

export type Renderer<T, E extends Record<string, any> = {}> = (
  field: IField<T, E>,
  onChange: (value: T) => void
) => ReactElement;

interface FieldEntry<T, E extends Record<string, any> = {}> {
  ctor: FieldConstructor<T, E>;
  renderer: Renderer<T, E>;
}

export class UnifiedFieldRegistry {
  private static registry = new Map<string, FieldEntry<any, any>>();

  static register<T, E extends Record<string, any> = {}>(
    type: string,
    ctor: FieldConstructor<T, E>,
    renderer: Renderer<T, E>
  ) {
    this.registry.set(type, { ctor, renderer });
  }

  static create<T, E extends Record<string, any> = {}>(
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

  static createFromJson<T, E extends Record<string, any> = {}>(
    json: { type: string; key: string; label: string; defaultValue?: T; extra?: E },
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
          json.extra
        );

    if (currentValues && currentValues[json.key] !== undefined) {
      field.value = currentValues[json.key] as T;
    }

    return field;
  }

  static render<T, E extends Record<string, any> = {}>(field: IField<T, E>, onChange: (value: T) => void) {
    const entry = this.registry.get(field.type) as FieldEntry<T, E> | undefined;
    if (!entry) throw new Error(`Renderer for type "${field.type}" not found`);
    return entry.renderer(field, onChange);
  }
}
