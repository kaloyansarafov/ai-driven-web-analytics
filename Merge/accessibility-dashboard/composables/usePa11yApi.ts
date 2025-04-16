import { ref } from "vue";
import axios from "axios";
import type { Pa11yResult } from "../types";

interface ApiError {
  message: string;
  response?: {
    status: number;
    data: any;
  };
}

export function usePa11yApi() {
  const isLoading = ref(false);
  const error = ref<ApiError | null>(null);
  const result = ref<Pa11yResult | null>(null);
  const runtimeConfig = useRuntimeConfig();

  const runTest = async (targetUrl: string, options?: Record<string, any>) => {
    isLoading.value = true;
    error.value = null;
    result.value = null;

    if (!targetUrl) {
      error.value = { message: "URL is required." };
      isLoading.value = false;
      return;
    }

    try {
      const response = await axios.post<Pa11yResult>(
        runtimeConfig.public.pa11yApiUrl,
        {
          url: targetUrl,
          ...options,
        },
        {
          timeout: 60000, // 60 seconds - Pa11y tests can take longer
        }
      );

      if (response.data) {
        result.value = response.data;
      } else {
        error.value = {
          message: "Pa11y returned an empty response.",
        };
      }
    } catch (err: any) {
      console.error("Pa11y API request failed:", err);
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
            err.message || "An unknown error occurred during the Pa11y test.",
        };
      }
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    result,
    runTest,
  };
}
