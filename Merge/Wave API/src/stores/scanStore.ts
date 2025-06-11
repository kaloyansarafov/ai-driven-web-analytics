import { defineStore } from "pinia";
import { ref } from "vue";
import type { WaveApiResponse } from "../types"; // Assuming a type definition file exists
import { useWaveApi } from "../composables/useWaveApi";

export const useScanStore = defineStore("scan", () => {
  const targetUrl = ref<string>("");
  const isLoading = ref<boolean>(false);
  const scanResult = ref<WaveApiResponse | null>(null);
  const error = ref<string | null>(null);

  // Use the composable internally
  const {
    isLoading: apiIsLoading,
    error: apiError,
    result: apiResult,
    fetchData,
  } = useWaveApi();

  function setTargetUrl(url: string) {
    targetUrl.value = url;
    // Optionally clear results/errors when URL is manually changed
    scanResult.value = null;
    error.value = null;
  }

  async function fetchScanResult(apiKey: string) {
    if (!targetUrl.value) {
      error.value = "URL is required.";
      return;
    }

    // Reset store state before fetching
    isLoading.value = true;
    error.value = null;
    scanResult.value = null;

    await fetchData(apiKey, targetUrl.value);

    // Update store state based on composable result
    isLoading.value = apiIsLoading.value; // This will become false when fetchData finishes

    if (apiError.value) {
      // Convert complex ApiError to a simple string for the store
      error.value = apiError.value.message;
      if (apiError.value.response?.data?.status?.error) {
        // Append specific WAVE API error if available
        error.value += `: ${apiError.value.response.data.status.error}`;
      } else if (apiError.value.response?.status) {
        error.value += ` (Status: ${apiError.value.response.status})`;
      }
      scanResult.value = null;
    } else if (apiResult.value) {
      scanResult.value = apiResult.value;
      error.value = null; // Clear any previous error
    } else {
      // Handle unexpected cases where fetchData finishes without result or error
      error.value = "An unexpected issue occurred while fetching results.";
      scanResult.value = null;
    }

    // Ensure loading state is false after processing
    // This might be redundant if fetchData ensures it, but good for safety
    isLoading.value = false;
  }

  return {
    targetUrl,
    isLoading,
    scanResult,
    error,
    setTargetUrl,
    fetchScanResult,
  };
});
