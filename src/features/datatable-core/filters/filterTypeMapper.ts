export const mapBackendTypeToFormType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'integer':
    case 'number':
    case 'float':
    case 'decimal':
      return 'number';
    case 'merchant_id':
      return 'merchant_id';

    case 'string':
    case 'text':
    case 'varchar':
      return 'text';

    case 'boolean':
    case 'bool':
      return 'select';

    case 'list':
    case 'select':
    case 'dropdown':
    case 'enum':
      return 'select';

    case 'multiselect':
      return 'multiselect';

    case 'date':
    case 'datetime':
    case 'timestamp':
      return 'date-range';

    case 'range':
    case 'slider':
      return 'range';

    default:
      return 'text';
  }
};
