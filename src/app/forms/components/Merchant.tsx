import { IField } from '@/features/form-builder/form-core/domain/field/IField';
import { SelectFieldExtra } from '@/features/form-builder/form-core/domain/extra/SelectFieldExtra';
import { AsyncSelect } from '@/features/form-builder/form-react-adapter/components/AsyncSelect';
import { MerchantService } from '@/app/api/private/merchant/service';
import { merchantToSelectOption } from '@/app/forms/transforms/options';
import { Merchant } from '@/app/entities/merchant';

export function MerchantFieldRenderer(
  field: IField<number | null, SelectFieldExtra>,
  onChange: (value: number | null) => void,
) {
  return (
    <AsyncSelect<Merchant>
      field={field}
      cacheKey="merchants"
      fetcher={(query) =>
        MerchantService.search({ search: query }).then((res) => (res.success ? res.data : []))
      }
      mapOption={(m) => merchantToSelectOption(m)}
      onChange={(value) => {
        if (value === null || value === '') {
          onChange(null);
          return;
        }
        const nextValue = typeof value === 'string' ? Number(value) : value;
        onChange(Number.isNaN(nextValue) ? null : nextValue);
      }}
    />
  );
}
