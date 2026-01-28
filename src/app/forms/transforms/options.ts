import { Currency } from '@/app/entities/currency';
import { Merchant } from '@/app/entities/merchant';
import { SelectOption } from '@/features/form-builder/form-core/domain/extra/SelectFieldExtra';

export const stringArrToSelectOptions = (val: string[]): SelectOption[] => {
  return val.map((network) => ({
    value: network,
    label: network,
  }));
};

export const merchantToSelectOption = (val: Merchant): SelectOption => ({
  value: val.id.toString(),
  label: 'Id: ' + val.id.toString() + ' ' + val.name,
});

export const currencyToSelectOption = (val: Currency): SelectOption => ({
  value: val.code_alpha,
  label: 'Id: ' + val.id.toString() + ' ' + val.title,
});
