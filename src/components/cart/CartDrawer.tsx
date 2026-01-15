"use client";

import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import { TR, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { Button } from "@/components/ui";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const subtotal = getTotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-stone-200 px-4 py-4 sm:px-6">
                      <DialogTitle className="text-lg font-semibold text-stone-900">
                        {TR.common.cart}
                      </DialogTitle>
                      <button
                        type="button"
                        className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-500"
                        onClick={onClose}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Cart items */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <ShoppingBag className="h-16 w-16 text-stone-300" />
                          <p className="mt-4 text-lg font-medium text-stone-900">
                            {TR.cart.empty}
                          </p>
                          <p className="mt-1 text-sm text-stone-500">
                            {TR.cart.emptyDescription}
                          </p>
                          <Button
                            onClick={onClose}
                            className="mt-6"
                            variant="outline"
                          >
                            {TR.cart.continueShopping}
                          </Button>
                        </div>
                      ) : (
                        <ul className="divide-y divide-stone-200">
                          {items.map((item) => (
                            <li key={item.id} className="flex py-6">
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

                              <div className="ml-4 flex flex-1 flex-col">
                                <div className="flex justify-between">
                                  <div>
                                    <h3 className="text-sm font-medium text-stone-900">
                                      <Link
                                        href={`/urunler/${item.slug}`}
                                        onClick={onClose}
                                      >
                                        {item.name}
                                      </Link>
                                    </h3>
                                    <p className="mt-1 text-sm text-stone-500">
                                      {formatPrice(item.salePrice ?? item.price)}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeItem(item.productId)}
                                    className="text-stone-400 hover:text-red-500"
                                  >
                                    <X className="h-5 w-5" />
                                  </button>
                                </div>

                                <div className="mt-auto flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item.productId,
                                          item.quantity - 1
                                        )
                                      }
                                      className="rounded-full p-1 text-stone-500 hover:bg-stone-100"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-8 text-center text-sm font-medium">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item.productId,
                                          item.quantity + 1
                                        )
                                      }
                                      disabled={item.quantity >= item.stock}
                                      className="rounded-full p-1 text-stone-500 hover:bg-stone-100 disabled:opacity-50"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </button>
                                  </div>
                                  <p className="text-sm font-medium text-stone-900">
                                    {formatPrice(
                                      (item.salePrice ?? item.price) *
                                        item.quantity
                                    )}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                      <div className="border-t border-stone-200 px-4 py-6 sm:px-6">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-stone-600">
                            <span>{TR.cart.subtotal}</span>
                            <span>{formatPrice(subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-stone-600">
                            <span>{TR.cart.shipping}</span>
                            <span>
                              {shipping === 0
                                ? TR.cart.shippingFree
                                : formatPrice(shipping)}
                            </span>
                          </div>
                          {subtotal < FREE_SHIPPING_THRESHOLD && (
                            <p className="text-xs text-amber-700">
                              {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}{" "}
                              daha ekleyin, kargo ücretsiz!
                            </p>
                          )}
                          <div className="flex justify-between border-t border-stone-200 pt-2 text-base font-medium text-stone-900">
                            <span>{TR.cart.total}</span>
                            <span>{formatPrice(total)}</span>
                          </div>
                        </div>
                        <div className="mt-6 space-y-3">
                          <Link href="/odeme" onClick={onClose}>
                            <Button className="w-full">
                              {TR.cart.proceedToCheckout}
                            </Button>
                          </Link>
                          <Link href="/sepet" onClick={onClose}>
                            <Button variant="outline" className="w-full">
                              Sepeti Görüntüle
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
