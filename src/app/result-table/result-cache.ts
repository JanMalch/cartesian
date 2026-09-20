export type ResultCacheKey = Record<string, string>;
export type ResultCacheValue = Record<string, string | boolean>;

export class ResultCache {
  private readonly cache = new Map<string, ResultCacheValue>();

  private cacheKey(data: ResultCacheKey): string {
    return JSON.stringify(Object.entries(data).sort(([a], [b]) => a.localeCompare(b)));
  }

  get(inputs: ResultCacheKey): ResultCacheValue | undefined {
    return this.cache.get(this.cacheKey(inputs));
  }

  set(inputs: ResultCacheKey, value: ResultCacheValue) {
    this.cache.set(this.cacheKey(inputs), value);
  }
}
