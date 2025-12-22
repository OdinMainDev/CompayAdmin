import type { BaseFieldExtra } from "../extra/BaseFieldExtra";
import type { IField } from "../field/IField";

export function createFieldCopy<T, E extends BaseFieldExtra>(
    originalField: IField<T, E>, 
    value: T
  ): IField<T, E> {
    if (typeof (originalField as any).clone === 'function') {
      return (originalField as any).clone(value);
    }
    
    const cloned = Object.create(Object.getPrototypeOf(originalField));
    
    Object.keys(originalField).forEach(key => {
      const propValue = (originalField as any)[key];
      if (propValue && typeof propValue === 'object' && !(propValue instanceof Date)) {
        (cloned as any)[key] = Array.isArray(propValue) 
          ? [...propValue] 
          : { ...propValue };
      } else {
        (cloned as any)[key] = propValue;
      }
    });
    
    cloned.value = value;
    
    return cloned;
  }