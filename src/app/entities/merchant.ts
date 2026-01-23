export interface Merchant {
    readonly id: number;
    readonly created_at: number;
    readonly updated_at: number;
    readonly name: string;
    readonly token: string;
    readonly is_enabled: boolean;
    readonly settings: MerchantSettings;
}

export interface MerchantSettings {
    blocked_countries: string[];
    allowed_countries: string[];
}