import React, { useEffect, useState } from 'react';
import { DatatableEngine } from '@/features/datatable-core/runtime/DatatableEngine';
import type { DatatableConfig } from '@/features/datatable-core/domain/entities/DatatableConfig';
import type { DatatableState } from '@/features/datatable-core/domain/entities/DatatableState';
import { DatatableHeader } from './DatatableHeader';
import { DatatableFooter } from './DatatableFooter';
import { DatatableBody } from './DatatableBody';
import type { IDatatableBackend } from '@/features/datatable-core/domain/ports/IDatatableBackend';
import { IRequestOptions } from '../../domain/entities/DatatableRequest';
import PageHeader from '@/components/dashboard/common/PageHeader';

interface DatatableProps<T> {
  pageTitle?: string,
  pageSubtitle?: string,
  config: DatatableConfig<T>;
  className?: string;
}

export function Datatable<T>({
  pageTitle,
  pageSubtitle,
  config,
  className = ''
}: DatatableProps<T>): React.ReactElement {
  const [engine, setEngine] = useState<DatatableEngine<T> | null>(null);
  const [state, setState] = useState<DatatableState<T> | null>(null);
  

  useEffect(() => {

    const initializeEngine = async () => {
      const backend = createBackendAdapter(config);
      const eventEmitter = createEventEmitter();

      
      const newEngine = new DatatableEngine<T>(
        config,
        backend,
        eventEmitter,
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
    return (
      <div className="datatable-loading">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
    {(pageTitle || pageSubtitle) && (
      <PageHeader
        title={pageTitle ?? ''}
        subtitle={pageSubtitle ?? ''}
      />
    )}
  
    <div className={`datatable card shadow-sm border-0 ${className}`}>
      <DatatableHeader
        config={config}
        engine={engine} 
        onAction={handleAction}
      />
      
      <DatatableBody
        config={config}
        engine={engine}
        onSort={handleSort}
        onRowClick={config.events?.onRowClick}
        onSelectionChange={handleSelectionChange}
      />
      
      {(config.pagination?.enabled ?? true) && (
        <DatatableFooter
          engine={engine}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  </>
  );
}

function createBackendAdapter<T>(config: DatatableConfig<T>): IDatatableBackend<T> {
  const methods = {
    async fetch(query: IRequestOptions) {
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
        return (this as Record<string, ActionMethod>)[actionId](data);
      }
      const currentAction = config.quickActions?.find(action => action.id === actionId);

      if (!currentAction) {
        throw new Error(`Action "${actionId}" not implemented`);
      }
      if (currentAction.handler) {
        return currentAction.handler();
      } else {
        throw new Error(`Action "${actionId}" does not have a handler`);
      }
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