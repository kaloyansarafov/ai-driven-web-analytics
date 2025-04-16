<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">Bookmarked URLs</h2>
      <div class="flex space-x-2">
        <button
          @click="addBookmark"
          class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Bookmark
        </button>
        <button
          @click="clearBookmarks"
          class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
          :disabled="historyStore.bookmarks.length === 0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v10m4-10v10m5-16l-7-7m0 0L0 4m12-4v12"
            />
          </svg>
          Clear All
        </button>
      </div>
    </div>

    <!-- Add bookmark form -->
    <div
      v-if="showAddForm"
      class="mb-6 p-4 border border-indigo-200 bg-indigo-50 rounded-md"
    >
      <h3 class="text-lg font-medium mb-3">Add URL Bookmark</h3>
      <form @submit.prevent="saveBookmark">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              for="url"
              class="block text-sm font-medium text-gray-700 mb-1"
              >URL</label
            >
            <input
              id="url"
              v-model="newBookmark.url"
              type="url"
              required
              placeholder="https://example.com"
              class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              for="title"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Title (Optional)</label
            >
            <input
              id="title"
              v-model="newBookmark.title"
              type="text"
              placeholder="My Website"
              class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="showAddForm = false"
            class="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Bookmark
          </button>
        </div>
      </form>
    </div>

    <div v-if="historyStore.bookmarks.length === 0" class="text-center py-10">
      <p class="text-lg text-gray-500">
        No bookmarks yet. Add URLs to bookmark them for quick access.
      </p>
    </div>

    <div v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                URL
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Added
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Scanned
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="bookmark in historyStore.bookmarks" :key="bookmark.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ bookmark.title || "Untitled" }}
                    </div>
                    <div class="text-sm text-gray-500">{{ bookmark.url }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatDate(bookmark.createdAt) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="bookmark.lastScanned" class="text-sm text-gray-900">
                  {{ formatDate(bookmark.lastScanned) }}
                </div>
                <div v-else class="text-sm text-gray-500">Not scanned yet</div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <button
                  @click="runScan(bookmark)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Run Scan
                </button>
                <button
                  @click="editBookmark(bookmark)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Edit
                </button>
                <button
                  @click="removeBookmark(bookmark.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit bookmark modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <h3 class="text-lg font-medium mb-4">Edit Bookmark</h3>
        <form @submit.prevent="updateBookmark">
          <div class="mb-4">
            <label
              for="edit-url"
              class="block text-sm font-medium text-gray-700 mb-1"
              >URL</label
            >
            <input
              id="edit-url"
              v-model="editedBookmark.url"
              type="url"
              required
              class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div class="mb-4">
            <label
              for="edit-title"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Title</label
            >
            <input
              id="edit-title"
              v-model="editedBookmark.title"
              type="text"
              class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="showEditModal = false"
              class="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useHistoryStore } from "~/stores/historyStore";
import type { UrlBookmark } from "~/types";
import { useRouter } from "vue-router";

const historyStore = useHistoryStore();
const router = useRouter();

// UI state
const showAddForm = ref(false);
const showEditModal = ref(false);

// New bookmark form data
const newBookmark = reactive({
  url: "",
  title: "",
});

// Edited bookmark data
const editedBookmark = reactive({
  id: "",
  url: "",
  title: "",
});

// Add a new bookmark
function addBookmark() {
  showAddForm.value = true;
  // Clear the form
  newBookmark.url = "";
  newBookmark.title = "";
}

// Save a new bookmark
function saveBookmark() {
  if (!newBookmark.url) return;

  historyStore.addBookmark(newBookmark.url, newBookmark.title);
  showAddForm.value = false;
}

// Edit an existing bookmark
function editBookmark(bookmark: UrlBookmark) {
  editedBookmark.id = bookmark.id;
  editedBookmark.url = bookmark.url;
  editedBookmark.title = bookmark.title || "";

  showEditModal.value = true;
}

// Update bookmark
function updateBookmark() {
  if (!editedBookmark.id || !editedBookmark.url) return;

  historyStore.updateBookmark(editedBookmark.id, {
    url: editedBookmark.url,
    title: editedBookmark.title,
  });

  showEditModal.value = false;
}

// Remove a bookmark
function removeBookmark(id: string) {
  if (confirm("Are you sure you want to remove this bookmark?")) {
    historyStore.removeBookmark(id);
  }
}

// Run a scan for a bookmarked URL
function runScan(bookmark: UrlBookmark) {
  router.push({
    path: "/",
    query: {
      url: bookmark.url,
    },
  });
}

// Clear all bookmarks
function clearBookmarks() {
  if (
    confirm(
      "Are you sure you want to clear all bookmarks? This cannot be undone."
    )
  ) {
    historyStore.clearBookmarks();
  }
}

// Format dates
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch (e) {
    return dateString;
  }
}
</script>
