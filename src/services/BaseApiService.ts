/**
 * TTGT Solutions Commerce Operations Platform
 * Centralized Base Api Service Class
 * 
 * Supports dynamic caching, automatic request retries, unified catch handlers,
 * response transformers, and resilient state handling for REST interfaces.
 */

export interface RequestOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
}

export class BaseApiService {
  protected static basePrefix: string = "";

  /**
   * Safe fetch runner wrapper support automatic retries and custom timeouts
   */
  protected static async request<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const { retries = 2, retryDelay = 1000, timeout = 8000, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const headers = new Headers(fetchOptions.headers || {});
    if (!headers.has("Content-Type") && !(fetchOptions.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
    
    // Auth headers config injection
    const sessionToken = localStorage.getItem("ttgt_session_token");
    if (sessionToken) {
      headers.set("Authorization", `Bearer ${sessionToken}`);
    }

    const config: RequestInit = {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    };

    let attempts = 0;
    while (attempts <= retries) {
      try {
        const response = await fetch(`${this.basePrefix}${url}`, config);
        clearTimeout(timeoutId);

        if (!response.ok) {
          // Unified Enterprise Error Handler
          const errData = await response.json().catch(() => ({}));
          throw new ApiError(
            errData.error || `HTTP request failed with status: ${response.status}`,
            response.status,
            errData.details
          );
        }

        // Failsafe empty response parsing
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          return (await response.json()) as T;
        }
        throw new ApiError(`Expected JSON response, but received Content-Type: ${contentType}`, 415);
      } catch (error: any) {
        if (error.name === "AbortError") {
          throw new ApiError("Handshake with operations hub timed out.", 408);
        }

        attempts++;
        if (attempts > retries) {
          throw error instanceof ApiError ? error : new ApiError(error.message || "Failed connection.", 500);
        }

        // Stagger retry exponentially
        await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, attempts - 1)));
      }
    }

    throw new ApiError("Service temporarily unreachable.", 503);
  }

  protected static get<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, { ...options, method: "GET" });
  }

  protected static post<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  protected static put<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  protected static delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, { ...options, method: "DELETE" });
  }
}

/**
 * Enterprise Custom Exception Class API Error
 */
export class ApiError extends Error {
  constructor(
    public override message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
