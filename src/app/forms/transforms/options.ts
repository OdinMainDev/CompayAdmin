import { SelectOption } from '@/features/form-builder/form-core/domain/extra/SelectFieldExtra';

export const stringArrToOptions = (val: string[]): SelectOption[] => {
  return val.map((network) => ({
    value: network,
    label: network,
  }));
};
