import type { ValidationResult } from './ValidationResult';

export interface Validator<T = any> {
  validate(value: T): ValidationResult;
}