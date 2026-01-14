import { t } from "i18next";
import type { ApiError } from "./types/core";

export class ApiErrorService {
    private static readonly ERROR_MAP: Record<string, string> = {
      "fa8af299-ee7d-4357-a466-c1746cf576c1": t("errors.usernameTaken"),
    };
  
    static getMessage(error: ApiError): string {
      return this.ERROR_MAP[error.error] || t("errors.default");
    }
  }