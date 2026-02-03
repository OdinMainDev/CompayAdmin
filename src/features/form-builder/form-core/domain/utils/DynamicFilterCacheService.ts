type Fetcher<T> = () => Promise<T[]>;

class DynamicFilterCacheService {
  private cache = new Map<string, unknown[]>();
  private promiseCache = new Map<string, Promise<unknown[]>>();

  async get<T>(key: string, fetcher: Fetcher<T>): Promise<T[]> {
    if (this.cache.has(key)) return this.cache.get(key) as T[];
    if (!this.promiseCache.has(key)) {
      const p = fetcher().then((data) => {
        this.cache.set(key, data);
        this.promiseCache.delete(key);
        return data as unknown[];
      });
      this.promiseCache.set(key, p);
    }
    return this.promiseCache.get(key) as Promise<T[]>;
  }

  invalidate(key?: string) {
    if (key) {
      this.cache.delete(key);
      this.promiseCache.delete(key);
    } else {
      this.cache.clear();
      this.promiseCache.clear();
    }
  }
}

export const DynamicFilterCache = new DynamicFilterCacheService();
