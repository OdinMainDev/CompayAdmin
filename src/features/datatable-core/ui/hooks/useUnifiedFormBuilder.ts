
import { useMemo } from 'react';
import { UnifiedFormAdapter } from '@/features/datatable-core/adapters/form/UnifiedFormAdapter';

export function useUnifiedFormBuilder<T>() {
    const formBuilder = useMemo(() => new UnifiedFormAdapter<T>(), []);
    
    return formBuilder;
  }