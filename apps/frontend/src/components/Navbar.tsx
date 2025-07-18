"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { ShoppingBag, Plus, Home, List } from 'lucide-react'
import { ModeToggle } from './mode-toggle'

export function Navbar() {
  const pathname = usePathname()
  
  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">RandoStore</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <Link href="/">
              <Button 
                variant={isActive('/') ? "secondary" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
            
            <Link href="/items">
              <Button 
                variant={isActive('/items') ? "secondary" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Browse</span>
              </Button>
            </Link>
            
            <Link href="/add-item">
              <Button 
                variant={isActive('/add-item') ? "secondary" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Sell</span>
              </Button>
            </Link>
            
            <Link href="/checkout">
              <Button 
                variant={isActive('/checkout') ? "secondary" : "ghost"}
                size="sm"
                className="flex items-center gap-2 relative"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Checkout</span>
                <Badge 
                  variant="destructive" 
                  className="h-5 w-5 p-0 text-xs flex items-center justify-center absolute -top-1 -right-1"
                >
                  0
                </Badge>
              </Button>
            </Link>
            
            {/* Theme Toggle - Your shadcn version */}
            <div className="ml-2 pl-2 border-l">
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}