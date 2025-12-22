import type { FormState } from "../runtime/FormState";

export class ValidateFormUseCase {
  execute(state: FormState): FormState {
    let isValid = true;

    const fields = Object.fromEntries(
      Object.entries(state.fields).map(([key, field]) => {
        let error: string | undefined;

        if (field.touched && field.value == null) {
          error = 'Required';
          isValid = false;
        }

        return [
          key,
          {
            ...field,
            error,
          },
        ];
      })
    );

    return {
      ...state,
      fields,
      isValid,
    };
  }
}
