import type { EntityMerchant } from "./merchant";

export type EntityUser = {
  username: string;
  merchant: EntityMerchant;
};