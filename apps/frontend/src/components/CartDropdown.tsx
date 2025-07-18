"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ShoppingBag, Plus, Minus, Trash2, ShoppingCart } from "lucide-react"
import { useCartStore } from "@/lib/store"
import Link from "next/link"

export function CartDropdown() {
  const { cart, totalItems, totalPrice, updateQuantity, removeFromCart } = useCartStore()

  if (totalItems === 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 relative">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="p-4 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 relative">
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Cart</span>
          <Badge 
            variant="destructive" 
            className="h-5 w-5 p-0 text-xs flex items-center justify-center absolute -top-1 -right-1"
          >
            {totalItems}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="p-4">
          <h3 className="font-semibold mb-4">Shopping Cart ({totalItems} items)</h3>
          
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {cart.map((cartItem) => (
              <div key={cartItem.item.id} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                  {cartItem.item.img ? (
                    <img 
                      src={cartItem.item.img} 
                      alt={cartItem.item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">No img</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{cartItem.item.name}</h4>
                  <p className="text-sm text-muted-foreground">${cartItem.item.price} each</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <span className="w-6 text-center text-sm">{cartItem.quantity}</span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive"
                    onClick={() => removeFromCart(cartItem.item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <DropdownMenuSeparator className="my-4" />
          
          <div className="space-y-3">
            <div className="flex justify-between items-center font-semibold">
              <span>Total: ${totalPrice.toFixed(2)}</span>
            </div>
            
            <Link href="/checkout" className="block">
              <Button className="w-full">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}