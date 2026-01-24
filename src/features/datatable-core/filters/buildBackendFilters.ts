
import { RawField, RawFormSection } from '@/features/form-builder/form-core/domain/field/RawFormSection';
import { FilterReponse } from '@/features/api-client/types/datatable';
import { mapBackendTypeToFormType } from './filterTypeMapper';
import { t } from 'i18next';

export const buildBackendFilters = (
  backendFilters: FilterReponse[]
): RawFormSection[] => {
  if (!backendFilters?.length) return [];

  return [
    {
      title: '',
      fields: backendFilters.map(filter => {
        const type = mapBackendTypeToFormType(filter.type);

        const field: RawField = {
          name: filter.name,
          label: t(filter.name),
          placeholder: t(filter.name),
          type,
        };

        if (['bool', 'boolean'].includes(filter.type.toLowerCase())) {
          field.options = [
            { label: t('yes'), value: true },
            { label: t('no'), value: false },
          ];
        }

        if (
          ['list', 'select', 'dropdown', 'enum', 'multiselect'].includes(filter.type.toLowerCase()) &&
          Array.isArray(filter.values)
        ) {
          field.options = filter.values.map(v => ({
            label: String(v),
            value: v,
          }));
        }

        return field;
      }),
    },
  ];
};
