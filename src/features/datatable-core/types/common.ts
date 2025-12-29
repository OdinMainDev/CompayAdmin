export type Nullable<T> = T | null | undefined;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ValueOf<T> = T[keyof T];

export type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type OmitStrict<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = 
  Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys];

export type RequireExactlyOne<T, Keys extends keyof T = keyof T> = {
  [K in Keys]: 
    Required<Pick<T, K>> & 
    Partial<Record<Exclude<Keys, K>, undefined>>
}[Keys] &
Omit<T, Keys>;