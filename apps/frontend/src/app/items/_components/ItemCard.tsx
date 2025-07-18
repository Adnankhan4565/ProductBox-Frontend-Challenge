"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { Item } from '@randostore/types'

interface ItemCardProps {
  item: Item
}

export default function ItemCard({ item }: ItemCardProps) {
  const { addToCart, isInCart, getItemQuantity, updateQuantity } = useCartStore()
  const [isAdding, setIsAdding] = useState(false)
  
  const inCart = isInCart(item.id)
  const quantity = getItemQuantity(item.id)
  
  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart(item)
    setTimeout(() => setIsAdding(false), 500)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center overflow-hidden">
          {item.img ? (
            <img 
              src={item.img} 
              alt={item.name}
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <span className="text-muted-foreground">No Image</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2">{item.name}</CardTitle>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${item.price}
          </span>
          
          {inCart ? (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(item.id, quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button 
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(item.id, quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button 
              size="sm" 
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              {isAdding ? 'Added!' : 'Add to Cart'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}