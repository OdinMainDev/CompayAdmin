import { BaseField } from './BaseField';
import type { ValidationResult } from '../validation/ValidationResult';
import type { ImageFieldExtra } from '../extra/ImageFieldExtra';

export type ImageValue = File | string | null;

export class ImageField extends BaseField<ImageValue, ImageFieldExtra> {
  type = 'image';

  validate(): ValidationResult {
    if (this.extra?.required && !this.value) {
      return {
        isValid: false,
        errors: ['Image is required'],
      };
    }

    if (
      this.value instanceof File &&
      this.extra?.maxSizeMb &&
      this.value.size > this.extra.maxSizeMb * 1024 * 1024
    ) {
      return {
        isValid: false,
        errors: [`Image must be <= ${this.extra.maxSizeMb}MB`],
      };
    }

    return { isValid: true, errors: [] };
  }

  static fromJson(json: {
    key: string;
    label: string;
    defaultValue?: ImageValue;
    options?: ImageFieldExtra;
  }) {
    return new ImageField(
      json.key,
      json.label,
      json.defaultValue ?? null,
      json.options
    );
  }
}
