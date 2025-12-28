import type { ValidationResult } from './ValidationResult';

export interface Validator<T = unknown> {
  validate(value: T): ValidationResult;
}