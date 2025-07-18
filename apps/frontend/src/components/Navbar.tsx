"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'

import { ShoppingBag, Plus, Home, List } from 'lucide-react'
import { SellItemModal } from './SellItemModal'
import { CartDropdown } from './CartDropdown'

export function Navbar() {
  const pathname = usePathname()
  
  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">RandoStore</span>
          </Link>
          
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
                        
            <SellItemModal />
            
            <CartDropdown />
            
            <div className="ml-2 pl-2 border-l">
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}