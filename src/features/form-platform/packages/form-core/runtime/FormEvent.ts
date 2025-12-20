export abstract class FormEvent {
    constructor(public fieldKey: string, public newValue: any, public timestamp = new Date()) {}
  }
  
  export class FieldUpdatedEvent extends FormEvent {}
  