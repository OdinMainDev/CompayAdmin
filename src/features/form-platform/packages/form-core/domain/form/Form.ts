import type { IField } from '../field/IField';
import { ValidationResult } from '../validation/ValidationResult';

export class Form {
  constructor(public id: string, private fields: IField[] = []) {}

  addField(field: IField) {
    this.fields.push(field);
  }

  getFields(): IField[] {
    return [...this.fields];
  }

  getField(key: string): IField | undefined {
    return this.fields.find(f => f.key === key);
  }

  validate(): ValidationResult[] {
    return this.fields.map(f => f.validate());
  }

  toJSON() {
    return {
      id: this.id,
      fields: this.fields.map(f => f.toJSON()),
    };
  }
}
