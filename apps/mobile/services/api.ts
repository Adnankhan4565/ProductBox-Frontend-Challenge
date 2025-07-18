import { Item } from "@randostore/types";

const getApiUrl = () => {
  return "https://product-box-assessment-backend.vercel.app";
};

const API_BASE_URL = getApiUrl();

export class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    console.log(`🌐 Making API request to: ${url}`);
    console.log(`📊 Request method: ${options?.method || "GET"}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });
    clearTimeout(timeoutId);

    console.log(`📡 Response status: ${response.status}`);

    if (!response.ok) {
      const text = await response.text();
      console.error(`❌ Server error (${response.status}): ${text}`);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // *** Handle 204 No Content ***
    if (response.status === 204) {
      return undefined as unknown as T;
    }

    const data = await response.json();
    console.log(`✅ API response for ${endpoint}:`, data);
    return data;
  }

  // GET /items
  async getItems(): Promise<Item[]> {
    return this.request<Item[]>("/items");
  }

  // GET /items/:id
  async getItem(id: number): Promise<Item> {
    return this.request<Item>(`/items/${id}`);
  }

  // POST /items
  async createItem(item: Omit<Item, "id">): Promise<Item> {
    return this.request<Item>("/items", {
      method: "POST",
      body: JSON.stringify(item),
    });
  }

  // DELETE /items/:id
  async deleteItem(id: number): Promise<void> {
    return this.request<void>(`/items/${id}`, {
      method: "DELETE",
    });
  }

  // PUT /items/:id
  async updateItem(
    id: number,
    item: Partial<Omit<Item, "id">> & { id: number }
  ): Promise<Item> {
    return this.request<Item>(`/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(item),
    });
  }
}

export const apiService = new ApiService();
