"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { Badge } from "@/components/ui";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice: number | null;
    image: string | null;
    stock: number;
    category?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) return;

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      image: product.image || "",
      stock: product.stock,
    });
  };

  const isOnSale = product.salePrice && product.salePrice < product.price;
  const discount = isOnSale
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  return (
    <Link
      href={`/urunler/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition-shadow hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-stone-300" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {isOnSale && (
            <Badge variant="error">%{discount} İndirim</Badge>
          )}
          {product.stock <= 0 && (
            <Badge variant="default">Tükendi</Badge>
          )}
        </div>

        {/* Quick actions */}
        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="rounded-full bg-white p-2 shadow-md transition-colors hover:bg-stone-50"
          >
            <Heart className="h-4 w-4 text-stone-600" />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="rounded-full bg-amber-700 p-2 shadow-md transition-colors hover:bg-amber-800 disabled:bg-stone-300"
          >
            <ShoppingBag className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {product.category && (
          <p className="text-xs font-medium text-amber-700">{product.category}</p>
        )}
        <h3 className="mt-1 text-sm font-medium text-stone-900 line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center gap-2 pt-2">
          {isOnSale ? (
            <>
              <span className="text-lg font-bold text-amber-700">
                {formatPrice(product.salePrice!)}
              </span>
              <span className="text-sm text-stone-400 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-stone-900">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
