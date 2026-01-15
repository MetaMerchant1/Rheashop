"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui";
import { TR } from "@/lib/constants";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice: number | null;
    image: string;
    stock: number;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      image: product.image,
      stock: product.stock,
      quantity,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  if (product.stock <= 0) {
    return (
      <Button disabled className="w-full" size="lg">
        <ShoppingBag className="mr-2 h-5 w-5" />
        Stokta Yok
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      {/* Quantity selector */}
      <div className="flex h-12 items-center rounded-lg border border-stone-300">
        <button
          onClick={decreaseQuantity}
          disabled={quantity <= 1}
          className="flex h-full w-12 items-center justify-center text-stone-600 hover:bg-stone-50 disabled:opacity-50"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-12 text-center font-medium">{quantity}</span>
        <button
          onClick={increaseQuantity}
          disabled={quantity >= product.stock}
          className="flex h-full w-12 items-center justify-center text-stone-600 hover:bg-stone-50 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Add to cart button */}
      <Button
        onClick={handleAddToCart}
        className="flex-1"
        size="lg"
        disabled={added}
      >
        {added ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            Sepete Eklendi
          </>
        ) : (
          <>
            <ShoppingBag className="mr-2 h-5 w-5" />
            {TR.common.addToCart}
          </>
        )}
      </Button>
    </div>
  );
}
