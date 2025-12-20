import { FieldRegistry } from './FieldRegistry';
import type { IField } from './IField';

type FieldConfig = {
  type: string;
  key: string;
  label: string;
  value: any;
};

export class FieldFactory {
  static create(config: FieldConfig): IField {
    return FieldRegistry.create(config.type, config.key, config.label, config.value);
  }
}
