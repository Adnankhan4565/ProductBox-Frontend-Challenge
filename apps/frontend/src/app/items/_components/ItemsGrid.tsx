"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Item } from '@randostore/types'
import ItemCard from './ItemCard'

interface ItemsGridProps {
  items: Item[]
  error: string | null
}

export default function ItemsGrid({ items, error }: ItemsGridProps) {
  const router = useRouter()

  const handleRetry = () => {
    router.refresh()
  }

  return (
    <>
      {error && (
        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}. <Button variant="link" onClick={handleRetry} className="p-0 h-auto">Try again</Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.length === 0 && !error ? (
          <div className="col-span-full text-center py-16">
            <h3 className="text-2xl font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground">Check back later for new items!</p>
          </div>
        ) : (
          items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))
        )}
      </div>
    </>
  )
}