import { FilterReponse } from '@/features/api-client/types/datatable';
import { mapBackendTypeToFormType } from './filterTypeMapper';
import { t } from 'i18next';
import { FormSection } from '@/features/form-builder/form-core/domain/field/FormSection';
import { UnifiedFieldRegistry } from '@/features/form-builder/form-react-adapter/UnifiedFieldRegistry';
import { AnyField } from '@/features/form-builder/form-react-adapter/fields';

export const buildBackendFilters = (backendFilters: FilterReponse[]): FormSection[] => {
  if (!backendFilters?.length) return [];

  return [
    {
      fields: backendFilters.map((filter) => {
        const formType = mapBackendTypeToFormType(filter.type);

        const FieldClass = UnifiedFieldRegistry.getConstructor(formType);
        if (!FieldClass) throw new Error(`No field registered for type "${formType}"`);

        const extra: Record<string, unknown> = {};

        if (['bool', 'boolean'].includes(filter.type.toLowerCase())) {
          extra.options = [
            { label: t('yes'), value: true },
            { label: t('no'), value: false },
          ];
        } else if (['select', 'multiselect', 'merchant_id'].includes(formType)) {
          extra.options = Array.isArray(filter.values)
            ? filter.values.map((v) => ({ label: String(v), value: v }))
            : [];
        } else if (formType === 'text') {
          extra.placeholder = t(filter.name);
        }

        const defaultValue = filter.values ?? null;

        const fieldInstance =
          'create' in FieldClass && typeof FieldClass.create === 'function'
            ? FieldClass.create(
                filter.name,
                t(`datatables.filters.${filter.name}`),
                extra,
                defaultValue,
              )
            : new FieldClass(
                filter.name,
                t(`datatables.filters.${filter.name}`),
                defaultValue,
                extra,
              );

        return fieldInstance as unknown as AnyField;
      }),
    },
  ];
};
