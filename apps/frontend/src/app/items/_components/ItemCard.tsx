"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { deleteItem } from "@/lib/api";
import { Item } from "@randostore/types";
import { ItemModal } from "@/components/ItemModal";

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const { addToCart, isInCart, getItemQuantity, updateQuantity } =
    useCartStore();
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const inCart = isInCart(item.id);
  const qty = getItemQuantity(item.id);

  const onAdd = () => {
    setAdding(true);
    addToCart(item);
    setTimeout(() => setAdding(false), 500);
  };

  const onDelete = async () => {
    if (!confirm(`Delete “${item.name}”?`)) return;
    setDeleting(true);
    try {
      await deleteItem(item.id);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
          {item.img ? (
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-muted-foreground">No Image</span>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2">{item.name}</CardTitle>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold">${item.price}</span>
          {inCart ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateQuantity(item.id, qty - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-6 text-center">{qty}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateQuantity(item.id, qty + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button onClick={onAdd} disabled={adding}>
              <ShoppingCart className="h-4 w-4 mr-1" />
              {adding ? "Added!" : "Add"}
            </Button>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <ItemModal item={item} />
        <Button
          variant="destructive"
          size="icon"
          onClick={onDelete}
          disabled={deleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
