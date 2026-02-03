import type { FormState } from '@/features/form-builder/form-core/application/FormState';
import type { SubmitFormUseCase } from '@/features/form-builder/form-core/application/SubmitFormUseCase';
export type FormEventPayload =
  | { type: 'FIELD_CHANGE'; fieldKey: string; value: unknown }
  | { type: 'FIELD_BLUR'; fieldKey: string }
  | { type: 'SUBMIT' }
  | { type: 'RESET' };

export class FormRuntime {
  private state: FormState;
  private listeners = new Set<(state: FormState) => void>();

  constructor(
    initialState: FormState,
    // private readonly validateUseCase: ValidateFormUseCase,
    private readonly submitUseCase: SubmitFormUseCase,
  ) {
    this.state = initialState;
  }

  getState(): FormState {
    return this.state;
  }

  subscribe(listener: (state: FormState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  dispatch(event: FormEventPayload): void {
    this.state = this.reduce(this.state, event);
    // this.state = this.validateUseCase.execute(this.state);
    this.emit();
  }

  private emit() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  private reduce(state: FormState, event: FormEventPayload): FormState {
    switch (event.type) {
      case 'FIELD_CHANGE': {
        const field = state.fields[event.fieldKey];
        return {
          ...state,
          fields: {
            ...state.fields,
            [event.fieldKey]: {
              ...field,
              value: event.value,
            },
          },
        };
      }

      case 'FIELD_BLUR': {
        const field = state.fields[event.fieldKey];
        return {
          ...state,
          fields: {
            ...state.fields,
            [event.fieldKey]: {
              ...field,
              touched: true,
            },
          },
        };
      }

      case 'SUBMIT': {
        void this.submit(state);
        return {
          ...state,
          isSubmitting: true,
        };
      }

      case 'RESET':
        return state;

      default:
        return state;
    }
  }

  private async submit(state: FormState) {
    this.state = await this.submitUseCase.execute(state);
    this.emit();
  }
}
