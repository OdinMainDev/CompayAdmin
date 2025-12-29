import type { DatatableQuery } from "../../domain/entities/DatatableQuery";
import type { DatatableResponse } from "../../domain/entities/DatatableResponse";
import type { FilterDefinition } from "../../domain/entities/FilterDefinition";
import type { IDatatableBackend } from "../../domain/ports/IDatatableBackend";

interface RestBackendConfig {
  baseURL: string;
  endpoints: {
    fetch: string;
    filters?: string;
    export?: string;
    actions?: string;
  };
  headers?: Record<string, string>;
  timeout?: number;
}

export class RestBackendAdapter<T = unknown> implements IDatatableBackend<T> {
  private config: RestBackendConfig;

  constructor(config: RestBackendConfig) {
    this.config = {
      timeout: 30000,
      ...config
    };
  }

  async fetch(query: DatatableQuery): Promise<DatatableResponse<T>> {
    const url = `${this.config.baseURL}${this.config.endpoints.fetch}`;
    
    const requestBody = this.serializeQuery(query);
    
    try {
      const response = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers
        }
      });
      
      return this.deserializeResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async fetchFilters(): Promise<FilterDefinition[]> {
    if (!this.config.endpoints.filters) {
      return [];
    }
    
    const url = `${this.config.baseURL}${this.config.endpoints.filters}`;
    
    try {
      const response = await this.makeRequest(url, {
        method: 'GET',
        headers: this.config.headers
      });
      
      return this.deserializeFilters(response);
    } catch (error) {
      console.error('Failed to fetch filters:', error);
      return [];
    }
  }

  async exportData(query: DatatableQuery, format: string): Promise<Blob> {
    if (!this.config.endpoints.export) {
      throw new Error('Export endpoint not configured');
    }
    
    const url = `${this.config.baseURL}${this.config.endpoints.export}`;
    
    const requestBody = {
      ...this.serializeQuery(query),
      format
    };
    
    try {
      const response = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers
        }
      });
      
      const blobData: BlobPart = response as BlobPart;

      return new Blob([blobData], { type: this.getMimeType(format) });
    } catch (error) {
      throw new Error(`Export failed: ${error}`);
    }
  }

  async executeAction(actionId: string, data: Record<string, unknown>): Promise<unknown> {
    if (!this.config.endpoints.actions) {
      throw new Error('Actions endpoint not configured');
    }
    
    const url = `${this.config.baseURL}${this.config.endpoints.actions}/${actionId}`;
    
    try {
      const response = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers
        }
      });
      
      return response;
    } catch (error) {
      throw new Error(`Action execution failed: ${error}`);
    }
  }

  private serializeQuery(query: DatatableQuery): Record<string, unknown> {
    const serialized: Record<string, unknown> = {
      page: query.pagination.page,
      pageSize: query.pagination.pageSize
    };
    
    if (query.sort && query.sort.length > 0) {
      serialized.sort = query.sort.map(s => ({
        field: s.column,
        order: s.direction,
        nulls: s.nulls
      }));
    }
    
    if (query.filters && query.filters.length > 0) {
      serialized.filters = query.filters;
    }
    
    if (query.search) {
      serialized.search = query.search;
    }
    
    if (query.columns && query.columns.length > 0) {
      serialized.fields = query.columns;
    }
    
    if (query.include && query.include.length > 0) {
      serialized.include = query.include;
    }
    
    if (query.groupBy && query.groupBy.length > 0) {
      serialized.groupBy = query.groupBy;
    }
    
    if (query.aggregates) {
      serialized.aggregates = query.aggregates;
    }
    
    return serialized;
  }

  private deserializeResponse(response: unknown): DatatableResponse<T> {
    const data = response as {
      data: T[];
      total: number;
      filtered?: number;
      success: boolean;
      message?: string;
      error?: string;
    };
    
    if (!data.success) {
      return {
        success: false,
        data: [],
        total: 0,
        filtered: 0,
        message: data.message || data.error || 'Unknown error'
      };
    }
    
    return {
      success: true,
      data: data.data || [],
      total: data.total || 0,
      filtered: data.filtered || data.total || 0
    };
  }

  private deserializeFilters(response: unknown): FilterDefinition[] {
    const filters = response as FilterDefinition[];
    return Array.isArray(filters) ? filters : [];
  }

  private async makeRequest(url: string, options: RequestInit): Promise<unknown> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        return await response.json();
      } else if (contentType?.includes('text/')) {
        return await response.text();
      } else {
        return await response.blob();
      }
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  private handleError(error: unknown): DatatableResponse<T> {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return {
      success: false,
      data: [],
      total: 0,
      filtered: 0,
      message: errorMessage
    };
  }

  private getMimeType(format: string): string {
    const mimeTypes: Record<string, string> = {
      csv: 'text/csv',
      excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      pdf: 'application/pdf',
      json: 'application/json'
    };
    
    return mimeTypes[format] || 'application/octet-stream';
  }
}