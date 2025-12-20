import { Form } from '../form-core/domain/form/Form';

export class JsonSchemaMapper {
  static toJson(form: Form) {
    return form.toJSON();
  }
}
