import type { FormState } from "./FormState";

export class SubmitFormUseCase {
  constructor(
    private readonly onSubmit: (values: Record<string, unknown>) => Promise<void>
  ) {}

  async execute(state: FormState): Promise<FormState> {
    if (!state.isValid) {
      return state;
    }

    const values = Object.fromEntries(
      Object.entries(state.fields).map(([key, field]) => [
        key,
        field.value,
      ])
    );

    await this.onSubmit(values);

    return {
      ...state,
      isSubmitting: false,
    };
  }
}
