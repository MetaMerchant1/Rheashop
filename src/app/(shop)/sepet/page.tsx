"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import { TR, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { Button } from "@/components/ui";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } =
    useCartStore();
  const subtotal = getTotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="mx-auto h-16 w-16 text-stone-300" />
        <h1 className="mt-4 text-2xl font-bold text-stone-900">
          {TR.cart.empty}
        </h1>
        <p className="mt-2 text-stone-600">{TR.cart.emptyDescription}</p>
        <Link href="/urunler" className="mt-8 inline-block">
          <Button>
            Alışverişe Başla
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-stone-900">{TR.common.cart}</h1>

      <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-8">
          <div className="border-b border-stone-200">
            <div className="hidden py-4 sm:grid sm:grid-cols-6 sm:gap-4">
              <span className="col-span-3 text-sm font-medium text-stone-500">
                Ürün
              </span>
              <span className="text-center text-sm font-medium text-stone-500">
                Fiyat
              </span>
              <span className="text-center text-sm font-medium text-stone-500">
                Adet
              </span>
              <span className="text-right text-sm font-medium text-stone-500">
                Toplam
              </span>
            </div>
          </div>

          <ul className="divide-y divide-stone-200">
            {items.map((item) => (
              <li key={item.id} className="py-6">
                <div className="flex flex-col gap-4 sm:grid sm:grid-cols-6 sm:items-center sm:gap-4">
                  {/* Product */}
                  <div className="col-span-3 flex gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-stone-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <Link
                        href={`/urunler/${item.slug}`}
                        className="font-medium text-stone-900 hover:text-amber-700"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="mt-2 flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                        {TR.cart.remove}
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-center">
                    <span className="text-stone-900">
                      {formatPrice(item.salePrice ?? item.price)}
                    </span>
                    {item.salePrice && (
                      <span className="ml-2 text-sm text-stone-400 line-through">
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-center">
                    <div className="flex items-center rounded-lg border border-stone-300">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="flex h-10 w-10 items-center justify-center text-stone-600 hover:bg-stone-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.stock}
                        className="flex h-10 w-10 items-center justify-center text-stone-600 hover:bg-stone-50 disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="text-right">
                    <span className="font-medium text-stone-900">
                      {formatPrice(
                        (item.salePrice ?? item.price) * item.quantity
                      )}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-between">
            <Link href="/urunler">
              <Button variant="outline">{TR.cart.continueShopping}</Button>
            </Link>
            <Button variant="ghost" onClick={clearCart} className="text-red-600">
              Sepeti Temizle
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-8 lg:col-span-4 lg:mt-0">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-6">
            <h2 className="text-lg font-semibold text-stone-900">
              Sipariş Özeti
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-stone-600">
                <span>{TR.cart.subtotal}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>{TR.cart.shipping}</span>
                <span>
                  {shipping === 0 ? TR.cart.shippingFree : formatPrice(shipping)}
                </span>
              </div>

              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                  {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} daha ekleyin,
                  kargo ücretsiz!
                </div>
              )}

              <div className="border-t border-stone-200 pt-4">
                <div className="flex justify-between text-lg font-semibold text-stone-900">
                  <span>{TR.cart.total}</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <Link href="/odeme" className="mt-6 block">
              <Button className="w-full" size="lg">
                {TR.cart.proceedToCheckout}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
