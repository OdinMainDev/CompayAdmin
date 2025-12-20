import type { FormRuntime } from '../runtime/FormRuntime';

export class ValidateFormUseCase {
  constructor(private runtime: FormRuntime) {}

  execute() {
    return this.runtime.validate();
  }
}
