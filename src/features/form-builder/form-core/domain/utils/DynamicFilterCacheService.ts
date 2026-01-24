type Fetcher<T> = () => Promise<T[]>;

class DynamicFilterCacheService {
  private cache = new Map<string, any[]>();
  private promiseCache = new Map<string, Promise<any[]>>();

  async get<T>(key: string, fetcher: Fetcher<T>): Promise<T[]> {
    if (this.cache.has(key)) return this.cache.get(key)!;
    if (!this.promiseCache.has(key)) {
      const p = fetcher().then((data) => {
        this.cache.set(key, data);
        this.promiseCache.delete(key);
        return data;
      });
      this.promiseCache.set(key, p);
    }
    return this.promiseCache.get(key)!;
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
