export interface Merchant {
  readonly id: number;
  readonly name: string;
  readonly creator_id: number;
  readonly owner_id: number;
  readonly is_enabled: boolean;
  readonly settings: MerchantSettings;
  readonly created_at: number;
  readonly updated_at: number;
}

export interface MerchantSettings {
  readonly conditions: MerchantConditions;
  readonly minimum_amounts: MerchantAmounts[];
  readonly minimum_confirmations: MerchantConfirmations[];
  readonly fee_amounts: MerchantFees[];
  readonly fee_percent_amounts: MerchantFees[];
  readonly public_settings: MerchantPublicSettings;
}

export interface MerchantAmounts {
  readonly currency: string;
  readonly amount: number;
}

export interface MerchantConfirmations {
  readonly currency: string;
  readonly count: number;
}

export interface MerchantFees {
  readonly currency: string;
  readonly fee_type: string;
  readonly amount: number;
}

export interface MerchantConditions {
  readonly blocked_countries: string[];
  readonly allowed_countries: string[];
}

export interface MerchantPublicSettings {
  readonly notification_telegram_chat_id: number;
}

/*           DTO           */

export interface MerchantDto {
  readonly name: string;
  readonly settings: MerchantDtoSettings;
}

export interface MerchantDtoSettings {
  readonly notification_telegram_chat_id: number;
}
