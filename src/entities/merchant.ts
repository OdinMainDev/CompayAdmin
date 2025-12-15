export type EntityMerchant = {
  name: string;
  token: string;
  is_enabled: string;
  settings: MerchantSettings;
};

export type MerchantSettings = {
  blocked_countries: string[];
  allowed_countries: string[];
};