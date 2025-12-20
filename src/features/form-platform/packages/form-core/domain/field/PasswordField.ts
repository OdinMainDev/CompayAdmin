import { TextField } from "./TextField";
import type { TextFieldExtra } from "../extra/TextFieldExtra";

export class PasswordField extends TextField {
    type = 'password';
  
    static fromJson(json: { key: string; label: string; defaultValue?: string; options?: TextFieldExtra }) {
      return new PasswordField(json.key, json.label, json.defaultValue ?? '', json.options);
    }
  }
  