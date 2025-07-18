"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { createItem, updateItem } from "@/lib/api";
import { Item } from "@randostore/types";

const itemSchema = z.object({
  name: z.string().min(1),
  price: z.string().min(1),
  img: z.url(),
});
type ItemForm = z.infer<typeof itemSchema>;

interface ItemModalProps {
  item?: Item;
}

export function ItemModal({ item }: ItemModalProps) {
  const isEdit = Boolean(item);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<ItemForm>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: item?.name ?? "",
      price: item?.price ?? "",
      img: item?.img ?? "",
    },
  });

  useEffect(() => {
    if (open && isEdit && item) {
      form.reset({ name: item.name, price: item.price, img: item.img });
    }
  }, [open, isEdit, item, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    let saved: Item | null = null;

    if (isEdit && item) {
      saved = await updateItem(item.id, values);
    } else {
      saved = await createItem(values);
    }

    if (saved) {
      setOpen(false);

      if (isEdit) {
        router.push("/items");
      } else {
        router.refresh();
      }
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">{isEdit ? "Edit" : "Sell"}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Item" : "List Item"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label>Name</Label>
                  <FormControl>
                    <Input placeholder="Item name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <Label>Price ($)</Label>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="img"
              render={({ field }) => (
                <FormItem>
                  <Label>Image URL</Label>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">{isEdit ? "Save" : "List"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
