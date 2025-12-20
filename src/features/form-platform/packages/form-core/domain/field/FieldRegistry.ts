import type { IField } from './IField';

type FieldConstructor = new (key: string, label: string, value: any) => IField;

export class FieldRegistry {
  private static registry = new Map<string, FieldConstructor>();

  static register(type: string, ctor: FieldConstructor) {
    this.registry.set(type, ctor);
  }

  static create(type: string, key: string, label: string, value: any): IField {
    const ctor = this.registry.get(type);
    if (!ctor) throw new Error(`Field type "${type}" is not registered`);
    return new ctor(key, label, value);
  }
}
