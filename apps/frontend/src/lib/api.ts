import { Item } from '@randostore/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchItems(): Promise<Item[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/items`);
    if (!response.ok) throw new Error('Failed to fetch');
    
    // Your backend returns items array directly
    const items = await response.json();
    return items;
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
}

export async function createItem(item: { name: string; price: string; img: string }): Promise<Item | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to create');
    
    // Your backend returns the created item directly
    const newItem = await response.json();
    return newItem;
  } catch (error) {
    console.error('Error creating item:', error);
    return null;
  }
}

export async function deleteItem(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting item:', error);
    return false;
  }
}