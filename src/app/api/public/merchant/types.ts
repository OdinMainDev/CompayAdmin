import { MerchantDto } from '@/app/entities/merchant';

export interface MerchantUpdateRequest {
  notification_telegram_chat_id: number;
}

export interface MerchantResponse {
  readonly success: boolean;
  readonly data: MerchantDto;
}

export interface MerchantStringResponse {
  readonly success: boolean;
  readonly data: string;
}
