"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Loader2 } from "lucide-react"
import { createItem } from "@/lib/api"


export function SellItemModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    img: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price || !formData.img) {
      return
    }

    setLoading(true)

    try {
      // Save to backend and wait for response
      const savedItem = await createItem(formData)
      
      // Only proceed if item was successfully created
      if (savedItem) {
        // Close modal and reset form
        setOpen(false)
        setFormData({ name: "", price: "", img: "" })
        
        
        console.log('Item saved to backend:', savedItem)
      }
      
    } catch (error) {
      console.error('Failed to save item:', error)
      // In a real app, you might want to show an error toast here
    } finally {
      setLoading(false)
    }
  }

  const isValid = formData.name.trim() && formData.price.trim() && formData.img.trim()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
       
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Sell</span>
          </Button>
    
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>List Your Item</DialogTitle>
          <DialogDescription>
            Add your item to the marketplace. Fill in all the details below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              placeholder="What are you selling?"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="img">Image URL *</Label>
            <Input
              id="img"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.img}
              onChange={(e) => setFormData(prev => ({ ...prev, img: e.target.value }))}
              required
            />
          </div>

          {/* Image Preview */}
          {formData.img && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src={formData.img} 
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-muted-foreground text-sm">Invalid image URL</span>'
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isValid || loading}
              className="flex items-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              List Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}