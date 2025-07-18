import { Badge } from "@/components/ui/badge"
import { fetchItems } from '@/lib/api'
import { Item } from '@randostore/types'
import ItemsGrid from "./_components/ItemsGrid"

export default async function ItemsPage() {
  let items: Item[] = []
  let error: string | null = null

  try {
    items = await fetchItems()
  } catch (err) {
    error = 'Failed to load items'
    console.error('Error loading items:', err)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Browse Items</h1>
          <p className="text-muted-foreground">Discover unique items from our community</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary">
            {items.length} items
          </Badge>       
        </div>
      </div>

      <ItemsGrid items={items} error={error} />
    </div>
  )
}