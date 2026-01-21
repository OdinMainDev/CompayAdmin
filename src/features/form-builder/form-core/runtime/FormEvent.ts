export type FormEvent =
  | {
      type: 'FIELD_CHANGE';
      fieldKey: string;
      value: unknown;
    }
  | {
      type: 'FIELD_BLUR';
      fieldKey: string;
    }
  | {
      type: 'SUBMIT';
    }
  | {
      type: 'RESET';
    };
