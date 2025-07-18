import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShoppingBag, Plus, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center">
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              Buy & Sell
              <span className="block bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                Random Treasures
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover unique items from people around the world. From vintage finds to everyday essentials – if it exists, someone's probably selling it here.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/items">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-primary hover:bg-primary/90 group">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Start Shopping
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link href="/items">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 group">
                  <Plus className="w-5 h-5 mr-2" />
                  Sell Your Items
                </Button>
              </Link>              
            </div>                        
          </div>
        </div>
      </section>
    </div>
  )
}