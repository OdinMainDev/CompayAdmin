import { useState, useEffect } from 'react';
import type { DatatableEngine } from '@/features/datatable-core/runtime/DatatableEngine';

export function useDatatableState<T>(engine: DatatableEngine<T>) {
  const [state, setState] = useState(() => engine.getState());

  useEffect(() => {
    const unsubscribe = engine.subscribe(() => {
      setState(engine.getState());
    });

    return () => unsubscribe();
  }, [engine]);

  return state;
}
