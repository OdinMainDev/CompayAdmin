import { IField } from '@/features/form-builder/form-core/domain/field/IField';
import { SelectFieldExtra } from '@/features/form-builder/form-core/domain/extra/SelectFieldExtra';
import { AsyncSelect } from '@/features/form-builder/form-react-adapter/components/AsyncSelect';
import { CurrencyService } from '@/app/api/currency/service';
import { currencyToSelectOption } from '@/app/forms/transforms/options';

export function CurrencyFieldRenderer(
  field: IField<number | null, SelectFieldExtra>,
  onChange: (value: number | null) => void,
) {
  return (
    <AsyncSelect
      field={field}
      cacheKey="currencies"
      fetcher={(query) =>
        CurrencyService.search({ search: query }).then((res) => (res.success ? res.data : []))
      }
      mapOption={(m) => currencyToSelectOption(m)}
      onChange={onChange}
    />
  );
}
