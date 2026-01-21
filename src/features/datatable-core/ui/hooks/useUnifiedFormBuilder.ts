
import { useMemo } from 'react';
import { UnifiedFormAdapter } from '../../adapters/form/UnifiedFormAdapter';

export function useUnifiedFormBuilder<T>() {
    const formBuilder = useMemo(() => new UnifiedFormAdapter<T>(), []);
    
    return formBuilder;
  }