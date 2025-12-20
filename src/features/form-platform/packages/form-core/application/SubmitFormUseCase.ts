import type { FormRuntime } from '../runtime/FormRuntime';

export class SubmitFormUseCase {
  constructor(private runtime: FormRuntime) {}

  execute() {
    const errors = this.runtime.validate();
    const hasErrors = errors.some(result => !result.isValid);
    if (hasErrors) {
      throw new Error('Form validation failed');
    }
    return this.runtime.getState();
  }
}
