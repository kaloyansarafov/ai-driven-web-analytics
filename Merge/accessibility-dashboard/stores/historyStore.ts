import { defineStore } from "pinia";
import type {
  ScanHistoryItem,
  UrlBookmark,
  UnifiedScanResults,
} from "../types";

export const useHistoryStore = defineStore("history", {
  state: () => ({
    scanHistory: [] as ScanHistoryItem[],
    bookmarks: [] as UrlBookmark[],
  }),

  actions: {
    /**
     * Add a new scan to history
     */
    addScanToHistory(results: UnifiedScanResults, toolsUsed: string[]) {
      const scanItem: ScanHistoryItem = {
        id: `scan_${Date.now()}`,
        url: results.url,
        title: results.title || results.url,
        timestamp: results.scanTime || new Date().toISOString(),
        toolsUsed,
        summary: {
          errors: results.statistics.errors,
          warnings: results.statistics.warnings,
          notices: results.statistics.notices,
        },
      };

      this.scanHistory.unshift(scanItem);

      // Limit history to last 50 scans
      if (this.scanHistory.length > 50) {
        this.scanHistory = this.scanHistory.slice(0, 50);
      }
    },

    /**
     * Remove a scan from history
     */
    removeScanFromHistory(id: string) {
      this.scanHistory = this.scanHistory.filter((item) => item.id !== id);
    },

    /**
     * Add a URL bookmark
     */
    addBookmark(url: string, title: string = "") {
      // Check if bookmark already exists
      if (this.bookmarks.some((b) => b.url === url)) {
        return;
      }

      const bookmark: UrlBookmark = {
        id: `bookmark_${Date.now()}`,
        url,
        title: title || url,
        createdAt: new Date().toISOString(),
        tags: [],
      };

      this.bookmarks.push(bookmark);
    },

    /**
     * Update a bookmark
     */
    updateBookmark(id: string, updates: Partial<UrlBookmark>) {
      const index = this.bookmarks.findIndex((b) => b.id === id);
      if (index !== -1) {
        this.bookmarks[index] = { ...this.bookmarks[index], ...updates };
      }
    },

    /**
     * Remove a bookmark
     */
    removeBookmark(id: string) {
      this.bookmarks = this.bookmarks.filter((b) => b.id !== id);
    },

    /**
     * Add tag to bookmark
     */
    addTagToBookmark(bookmarkId: string, tag: string) {
      const bookmark = this.bookmarks.find((b) => b.id === bookmarkId);
      if (bookmark) {
        if (!bookmark.tags) {
          bookmark.tags = [];
        }
        if (!bookmark.tags.includes(tag)) {
          bookmark.tags.push(tag);
        }
      }
    },

    /**
     * Remove tag from bookmark
     */
    removeTagFromBookmark(bookmarkId: string, tag: string) {
      const bookmark = this.bookmarks.find((b) => b.id === bookmarkId);
      if (bookmark && bookmark.tags) {
        bookmark.tags = bookmark.tags.filter((t) => t !== tag);
      }
    },

    /**
     * Update last scanned timestamp for a bookmark
     */
    updateBookmarkLastScanned(url: string) {
      const bookmark = this.bookmarks.find((b) => b.url === url);
      if (bookmark) {
        bookmark.lastScanned = new Date().toISOString();
      }
    },

    /**
     * Clear all history
     */
    clearHistory() {
      this.scanHistory = [];
    },

    /**
     * Clear all bookmarks
     */
    clearBookmarks() {
      this.bookmarks = [];
    },
  },

  persist: true,
});
