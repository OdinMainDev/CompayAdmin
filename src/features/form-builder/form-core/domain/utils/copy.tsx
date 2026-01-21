import type { BaseFieldExtra } from "@/features/form-builder/form-core/domain/extra/BaseFieldExtra";
import type { IField } from "@/features/form-builder/form-core/domain/field/IField";

export interface FieldFactory<T, E extends BaseFieldExtra> {
  createCopy(original: IField<T, E>, value: T): IField<T, E>;
}

const fieldFactories = new Map<string, FieldFactory<unknown, BaseFieldExtra>>();

export function registerFieldFactory<T, E extends BaseFieldExtra>(
  type: string,
  factory: FieldFactory<T, E>
): void {
  fieldFactories.set(type, factory as FieldFactory<unknown, BaseFieldExtra>);
}

export function createFieldCopy<T, E extends BaseFieldExtra>(
  originalField: IField<T, E>, 
  value: T
): IField<T, E> {
  const factory = fieldFactories.get(originalField.type);
  if (factory) {
    return factory.createCopy(originalField, value) as IField<T, E>;
  }
  const copy = Object.create(Object.getPrototypeOf(originalField)) as IField<T, E>;
  
  Object.keys(originalField).forEach(key => {
    const prop = key as keyof IField<T, E>;
    const originalValue = originalField[prop];
    
    if (typeof originalValue !== 'function' && originalValue !== undefined) {
      (copy as any)[key] = originalValue;
    }
  });
  
  copy.validate = originalField.validate.bind(copy);
  copy.toJSON = originalField.toJSON.bind(copy);
  
  if (originalField.extra) {
    copy.extra = deepClone(originalField.extra) as E;
  }
  
  copy.value = value;
  
  return copy;
}

function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as T;
  }
  
  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
}