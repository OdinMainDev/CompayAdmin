import { Form } from '../domain/form/Form';
import { FormEvent, FieldUpdatedEvent } from './FormEvent';
import type { IField } from '../domain/field/IField';

export class FormRuntime {
  private events: FormEvent[] = [];

  constructor(private form: Form) {}

  getState() {
    return this.form.toJSON();
  }

  getFields(): IField[] {
    return this.form.getFields();
  }

  updateField(key: string, value: any) {
    const field = this.form.getField(key);
    if (!field) throw new Error(`Field with key "${key}" not found`);

    (field as any).value = value;
    const event = new FieldUpdatedEvent(key, value);
    this.events.push(event);
  }

  getEventLog(): FormEvent[] {
    return [...this.events];
  }

  validate() {
    return this.form.validate();
  }
}
