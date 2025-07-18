import { Item } from "@randostore/types";

const API =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://product-box-assessment-backend.vercel.app";

export async function fetchItems(): Promise<Item[]> {
  const res = await fetch(`${API}/items`);
  if (!res.ok) throw new Error("Could not load items");
  return res.json();
}

export async function fetchItem(id: number): Promise<Item> {
  const res = await fetch(`${API}/items/${id}`);
  if (!res.ok) throw new Error("Could not load item");
  return res.json();
}

export async function createItem(data: Omit<Item, "id">): Promise<Item> {
  const res = await fetch(`${API}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Could not create item");
  return res.json();
}

export async function updateItem(
  id: number,
  data: Partial<Omit<Item, "id">>
): Promise<Item> {
  const res = await fetch(`${API}/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error("Could not update item");
  return res.json();
}

export async function deleteItem(id: number): Promise<void> {
  const res = await fetch(`${API}/items/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Could not delete item");
}
