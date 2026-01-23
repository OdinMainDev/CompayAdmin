import React, { useEffect, useState } from 'react';
import { DatatableEngine } from '@/features/datatable-core/runtime/DatatableEngine';
import type { DatatableConfig } from '@/features/datatable-core/domain/entities/DatatableConfig';
import type { DatatableState } from '@/features/datatable-core/domain/entities/DatatableState';
import { DatatableHeader } from './DatatableHeader';
import { DatatableFooter } from './DatatableFooter';
import type { ApiDatatableQuery } from '@/features/datatable-core/domain/entities/DatatableQuery';
import { DatatableBody } from './DatatableBody';
import type { IDatatableBackend } from '@/features/datatable-core/domain/ports/IDatatableBackend';
import { useUnifiedFormBuilder } from '@/features/datatable-core/ui/hooks/useUnifiedFormBuilder';

interface DatatableProps<T> {
  config: DatatableConfig<T>;
  className?: string;
}

export function Datatable<T>({
  config,
  className = ''
}: DatatableProps<T>): React.ReactElement {
  const [engine, setEngine] = useState<DatatableEngine<T> | null>(null);
  const [state, setState] = useState<DatatableState<T> | null>(null);
  const formAdapter = useUnifiedFormBuilder<T>(); 
  

  useEffect(() => {

    const initializeEngine = async () => {
      const backend = createBackendAdapter(config);
      const eventEmitter = createEventEmitter();

      
      const newEngine = new DatatableEngine<T>(
        config,
        backend,
        eventEmitter,
        formAdapter 
      );

      const initialState = await newEngine.initialize();
      
      setEngine(newEngine);
      setState(initialState);

      eventEmitter.on('data-loaded', () => {
        setState(newEngine.getState());
      });

      eventEmitter.on('state-changed', () => {
        setState(newEngine.getState());
      });
    };

    initializeEngine();
  }, [config]);

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    if (engine) {
      engine.sort(column, direction);
    }
  };


  const handlePageChange = (page: number) => {
    if (engine) {
      engine.changePage(page);
    }
  };

  const handlePageSizeChange = (pageSize: number) => {
    if (engine) {
      engine.changePageSize(pageSize);
    }
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    if (engine) {
      engine.selectRows(selectedIds);
    }
  };
  const handleAction = async (actionId: string, formData?: Record<string, unknown>) => {
    if (engine) {
      await engine.executeAction(actionId, formData);
    }
  };

  if (!engine || !state) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`datatable ${className}`}>
      <DatatableHeader
        config={config}
        state={state}
        engine={engine} 
        onAction={handleAction}
      />
      
      <DatatableBody
        config={config}
        engine={engine}
        state={state}
        onSort={handleSort}
        onRowClick={config.events?.onRowClick}
        onSelectionChange={handleSelectionChange}
      />
      
      {(config.pagination?.enabled ?? true) && (
        <DatatableFooter
          state={state}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}


function createBackendAdapter<T>(config: DatatableConfig<T>): IDatatableBackend<T> {
  const methods = {
    async fetch(query: ApiDatatableQuery) {
      if (typeof config.dataSource === 'function') {
        return config.dataSource(query);
      }
      throw new Error('Backend adapter not implemented');
    },
    
    async fetchFilters() {
      if (config.filtersSource) {
        if (typeof config.filtersSource === 'function') {
          return config.filtersSource();
        }
      }
      return { success: true, data: [] }; 
    },
    
    async export(query: ApiDatatableQuery, format: 'csv' | 'excel') {
      if (config.export?.handler) {
        return config.export.handler(query, format);
      }
      
      return { 
        success: true, 
        data: { url: '#', filename: `export.${format}` } 
      };
    },
    async add(_: Record<string, unknown>) {
      const addAction = config.quickActions?.find(action => action.id === 'add');
      
      if (addAction?.handler) {
        return addAction.handler();
      }
      throw new Error('Add action not configured');
    },
    async executeAction(actionId: string, data: Record<string, unknown>) {
      type ActionMethod = (data: Record<string, unknown>) => Promise<unknown>;
      
      const hasMethod = (obj: object, key: string): obj is { [key: string]: ActionMethod } => {
        return key in obj && typeof (obj as any)[key] === 'function';
      };
      
      if (hasMethod(this, actionId)) {
        console.log(data);
        return (this as Record<string, ActionMethod>)[actionId](data);
      }
      
      throw new Error(`Action "${actionId}" not implemented`);
    }
  };
  
  return methods;
}
function createEventEmitter(): any {
  const listeners = new Map();
  
  return {
    emit: (event: string, data: unknown) => {
      const eventListeners = listeners.get(event) || [];
      eventListeners.forEach((listener: (data: unknown) => void) => listener(data));
    },
    on: (event: string, handler: (data: unknown) => void) => {
      const eventListeners = listeners.get(event) || [];
      eventListeners.push(handler);
      listeners.set(event, eventListeners);
      
      return () => {
        const filtered = eventListeners.filter((h: (data: unknown) => void) => h !== handler);
        listeners.set(event, filtered);
      };
    },
    off: (event: string, handler: (data: unknown) => void) => {
      const eventListeners = listeners.get(event) || [];
      const filtered = eventListeners.filter((h: (data: unknown) => void) => h !== handler);
      listeners.set(event, filtered);
    }
  };
}