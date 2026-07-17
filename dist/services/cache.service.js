var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nitrostack/core';
/**
 * Simple in-memory cache service with TTL support
 * Can be extended to use file-based caching or Redis
 */
let CacheService = class CacheService {
    cache = new Map();
    /**
     * Get a value from cache if it exists and hasn't expired
     */
    get(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        const now = Date.now();
        const age = now - entry.timestamp;
        if (age > entry.ttl) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }
    /**
     * Set a value in cache with TTL (in milliseconds)
     */
    set(key, data, ttl = 86400000) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }
    /**
     * Check if a key exists and is not expired
     */
    has(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return false;
        const now = Date.now();
        const age = now - entry.timestamp;
        if (age > entry.ttl) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }
    /**
     * Delete a specific key from cache
     */
    delete(key) {
        this.cache.delete(key);
    }
    /**
     * Clear all cache entries
     */
    clear() {
        this.cache.clear();
    }
    /**
     * Get cache statistics
     */
    getStats() {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
                key,
                age: Date.now() - entry.timestamp,
                ttl: entry.ttl,
                expired: Date.now() - entry.timestamp > entry.ttl
            }))
        };
    }
};
CacheService = __decorate([
    Injectable()
], CacheService);
export { CacheService };
//# sourceMappingURL=cache.service.js.map