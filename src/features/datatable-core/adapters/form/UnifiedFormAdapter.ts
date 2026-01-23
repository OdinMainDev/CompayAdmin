
import { JsonFormLoader } from '@/features/form-builder/form-react-adapter/JsonFormLoader';
import type { IDatatableFormBuilder, FormSchema, FormInstance } from '@/features/datatable-core/domain/ports/IDatatableFormBuilder';

export class UnifiedFormAdapter<T> implements IDatatableFormBuilder<T> {
  

  createActionForm(actionId: string): FormSchema {
    return [{
      title: 'Confirmation', 
      fields: [
        {
          name: 'confirmation',
          type: 'text',
          label: 'Confirm Action',
          extra: {
            readonly: true,
            defaultValue: `Are you sure you want to perform "${actionId}"?`
          }
        }
      ]
    }];
  }

  createQuickFilterForm(): FormSchema {
    return [{
      title: 'Quick Search', 
      fields: [
        {
          name: 'quick_search',
          type: 'text',
          label: 'Quick Search',
          extra: {
            placeholder: 'Type to search...'
          }
        }
      ]
    }];
  }

  getFormInstance(schema: FormSchema): FormInstance {
    const sections = JsonFormLoader.loadForm(schema, {});
    const fields = sections.flatMap(s => s.fields);
    
    const values: Record<string, unknown> = {};
    
    return {
      validate: async () => {
        for (const field of fields) {
          const result = field.validate();
          if (!result.isValid) {
            return false;
          }
        }
        return true;
      },
      
      submit: async () => {
        for (const field of fields) {
          values[field.name] = field.value;
        }
        
        const valid = true;
        return {
          valid,
          data: { ...values }
        };
      },
      
      getValues: () => ({ ...values }),
      
      setValue: (fieldName: string, value: unknown) => {
        values[fieldName] = value;
        const field = fields.find(f => f.name === fieldName);
        if (field) {
        }
      },
      
      reset: () => {
        Object.keys(values).forEach(key => {
          delete values[key];
        });
      },
      
      fields
    };
  }

}