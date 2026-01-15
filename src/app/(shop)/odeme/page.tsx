"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ChevronRight, Lock } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import { TR, SHIPPING_COST, FREE_SHIPPING_THRESHOLD, TURKISH_CITIES } from "@/lib/constants";
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressInput } from "@/lib/validations";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, getTotal, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = getTotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
  });

  // Redirect to login if not authenticated
  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-700 border-t-transparent" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <Lock className="mx-auto h-16 w-16 text-stone-300" />
        <h1 className="mt-4 text-2xl font-bold text-stone-900">
          Giriş Yapmalısınız
        </h1>
        <p className="mt-2 text-stone-600">
          Ödeme yapabilmek için lütfen giriş yapın veya kayıt olun.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/giris">
            <Button>{TR.common.login}</Button>
          </Link>
          <Link href="/kayit">
            <Button variant="outline">{TR.common.register}</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="mx-auto h-16 w-16 text-stone-300" />
        <h1 className="mt-4 text-2xl font-bold text-stone-900">
          Sepetiniz boş
        </h1>
        <p className="mt-2 text-stone-600">
          Ödeme yapmak için önce sepetinize ürün ekleyin.
        </p>
        <Link href="/urunler" className="mt-8 inline-block">
          <Button>Alışverişe Başla</Button>
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: AddressInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: data,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Sipariş oluşturulamadı");
        return;
      }

      // For now, redirect to success page
      // In production, this would redirect to iyzico payment page
      clearCart();
      router.push(`/siparis-basarili/${result.orderNumber}`);
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-stone-500">
        <Link href="/sepet" className="hover:text-amber-700">
          Sepet
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-stone-900">Ödeme</span>
      </nav>

      <h1 className="text-3xl font-bold text-stone-900">{TR.checkout.title}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Shipping Form */}
          <div className="lg:col-span-7">
            <Card>
              <CardHeader>
                <CardTitle>{TR.checkout.shipping}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <Input
                  label={TR.address.title}
                  placeholder="Ev, İş vb."
                  error={errors.title?.message}
                  {...register("title")}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={TR.address.firstName}
                    error={errors.firstName?.message}
                    {...register("firstName")}
                  />
                  <Input
                    label={TR.address.lastName}
                    error={errors.lastName?.message}
                    {...register("lastName")}
                  />
                </div>

                <Input
                  label={TR.address.phone}
                  placeholder="05XX XXX XX XX"
                  error={errors.phone?.message}
                  {...register("phone")}
                />

                <Input
                  label={TR.address.address}
                  placeholder="Mahalle, Sokak, Bina No, Daire No"
                  error={errors.address?.message}
                  {...register("address")}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-stone-700">
                      {TR.address.city}
                    </label>
                    <select
                      className="flex h-11 w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-base focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      {...register("city")}
                    >
                      <option value="">Seçiniz</option>
                      {TURKISH_CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="mt-1.5 text-sm text-red-600">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <Input
                    label={TR.address.district}
                    error={errors.district?.message}
                    {...register("district")}
                  />
                </div>

                <Input
                  label={TR.address.postalCode}
                  placeholder="34000"
                  error={errors.postalCode?.message}
                  {...register("postalCode")}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="mt-8 lg:col-span-5 lg:mt-0">
            <Card>
              <CardHeader>
                <CardTitle>{TR.checkout.review}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Items */}
                <ul className="divide-y divide-stone-200">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 py-4">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-stone-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-stone-900">
                          {item.name}
                        </p>
                        <p className="text-sm text-stone-500">
                          {item.quantity} adet
                        </p>
                      </div>
                      <p className="text-sm font-medium text-stone-900">
                        {formatPrice(
                          (item.salePrice ?? item.price) * item.quantity
                        )}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* Totals */}
                <div className="mt-4 space-y-2 border-t border-stone-200 pt-4">
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
                  <div className="flex justify-between border-t border-stone-200 pt-2 text-lg font-semibold text-stone-900">
                    <span>{TR.cart.total}</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="mt-6 w-full"
                  size="lg"
                  isLoading={isLoading}
                >
                  <Lock className="mr-2 h-5 w-5" />
                  {TR.checkout.placeOrder}
                </Button>

                <p className="mt-4 text-center text-xs text-stone-500">
                  Siparişi tamamlayarak{" "}
                  <Link href="/kullanim-kosullari" className="underline">
                    Kullanım Koşullarını
                  </Link>{" "}
                  kabul etmiş olursunuz.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
