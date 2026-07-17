/**
 * Simple in-memory cache service with TTL support
 * Can be extended to use file-based caching or Redis
 */
export declare class CacheService {
    private cache;
    /**
     * Get a value from cache if it exists and hasn't expired
     */
    get<T>(key: string): T | null;
    /**
     * Set a value in cache with TTL (in milliseconds)
     */
    set<T>(key: string, data: T, ttl?: number): void;
    /**
     * Check if a key exists and is not expired
     */
    has(key: string): boolean;
    /**
     * Delete a specific key from cache
     */
    delete(key: string): void;
    /**
     * Clear all cache entries
     */
    clear(): void;
    /**
     * Get cache statistics
     */
    getStats(): {
        size: number;
        entries: {
            key: string;
            age: number;
            ttl: number;
            expired: boolean;
        }[];
    };
}
//# sourceMappingURL=cache.service.d.ts.map