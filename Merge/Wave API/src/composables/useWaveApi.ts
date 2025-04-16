import axios from "axios";
import { ref } from "vue";
import type { WaveApiResponse } from "../types";

// Define potential error structure from the API or Axios
interface ApiError {
  message: string;
  response?: {
    // Optional: Axios error response details
    status: number;
    data: any;
  };
}

export function useWaveApi() {
  const isLoading = ref(false);
  const error = ref<ApiError | null>(null);
  const result = ref<WaveApiResponse | null>(null);

  const fetchData = async (apiKey: string, targetUrl: string) => {
    isLoading.value = true;
    error.value = null;
    result.value = null;

    // Basic validation (already done in component, but good practice here too)
    if (!apiKey || !targetUrl) {
      error.value = { message: "API Key and Target URL are required." };
      isLoading.value = false;
      return;
    }

    const waveApiUrl = "https://wave.webaim.org/api/request";

    try {
      const response = await axios.get<WaveApiResponse>(waveApiUrl, {
        params: {
          key: apiKey,
          url: targetUrl,
          reporttype: 3, // Request JSON format
          // Add other parameters if needed, e.g., viewportwidth
        },
        // Optional: Add timeout
        // timeout: 30000, // 30 seconds
      });

      if (
        response.data &&
        response.data.status &&
        response.data.status.success
      ) {
        result.value = response.data;
      } else {
        // Handle cases where the API call succeeds but WAVE reports an issue (e.g., URL invalid)
        error.value = {
          message:
            response.data?.status?.error ||
            "WAVE API reported an error processing the URL.",
        };
      }
    } catch (err: any) {
      console.error("WAVE API request failed:", err);
      if (axios.isAxiosError(err)) {
        error.value = {
          message: err.message,
          response: {
            status: err.response?.status ?? 0,
            data: err.response?.data,
          },
        };
      } else {
        error.value = {
          message:
            err.message || "An unknown error occurred during the API request.",
        };
      }
      result.value = null; // Ensure result is null on error
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    result,
    fetchData,
  };
}
