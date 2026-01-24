import { IField } from '@/features/form-builder/form-core/domain/field/IField';
import {
  SelectFieldExtra,
} from '@/features/form-builder/form-core/domain/extra/SelectFieldExtra';
import { AsyncSelect } from '../AsyncSelect';
import { MerchantService } from '@/app/api/merchant/service';

export function MerchantFieldRenderer(
    field: IField<number | null, SelectFieldExtra>,
    onChange: (value: number | null) => void
  ) {
    return <AsyncSelect
        field={field}
        cacheKey="merchants"
        fetcher={() => MerchantService.search().then(res => res.success ? res.data : [])}
        onChange={onChange}
    />
  }
  