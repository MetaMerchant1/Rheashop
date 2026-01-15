import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Card, CardContent, Badge, Button } from "@/components/ui";
import { TR } from "@/lib/constants";

async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/giris");
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-stone-500">
        <Link href="/hesabim" className="hover:text-amber-700">
          Hesabım
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-stone-900">Siparişlerim</span>
      </nav>

      <h1 className="text-3xl font-bold text-stone-900">{TR.order.myOrders}</h1>

      {orders.length > 0 ? (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-stone-900">
                      {TR.order.orderNumber}: {order.orderNumber}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        order.status === "DELIVERED"
                          ? "success"
                          : order.status === "CANCELLED"
                          ? "error"
                          : "warning"
                      }
                    >
                      {TR.order.status[order.status]}
                    </Badge>
                    <span className="font-medium text-stone-900">
                      {formatPrice(Number(order.total))}
                    </span>
                  </div>
                </div>

                <div className="mt-4 border-t border-stone-100 pt-4">
                  <p className="text-sm text-stone-500">
                    {order.items.length} ürün
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {order.items.slice(0, 3).map((item) => (
                      <span
                        key={item.id}
                        className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700"
                      >
                        {item.name} x{item.quantity}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700">
                        +{order.items.length - 3} ürün daha
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Link href={`/siparis-takip/${order.orderNumber}`}>
                    <Button variant="outline" size="sm">
                      Detayları Gör
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-8 text-center">
          <Package className="mx-auto h-16 w-16 text-stone-300" />
          <p className="mt-4 text-lg font-medium text-stone-900">
            Henüz siparişiniz bulunmuyor
          </p>
          <p className="mt-2 text-stone-600">
            İlk siparişinizi vermek için alışverişe başlayın.
          </p>
          <Link href="/urunler" className="mt-6 inline-block">
            <Button>Alışverişe Başla</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
