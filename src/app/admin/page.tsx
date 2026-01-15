import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { TR } from "@/lib/constants";

async function getStats() {
  try {
    const [totalProducts, totalOrders, totalUsers, recentOrders, totalRevenue] =
      await Promise.all([
        prisma.product.count({ where: { isActive: true } }),
        prisma.order.count(),
        prisma.user.count(),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { name: true, email: true } },
            items: true,
          },
        }),
        prisma.order.aggregate({
          where: { paymentStatus: "PAID" },
          _sum: { total: true },
        }),
      ]);

    return {
      totalProducts,
      totalOrders,
      totalUsers,
      recentOrders,
      totalRevenue: totalRevenue._sum.total
        ? Number(totalRevenue._sum.total)
        : 0,
    };
  } catch {
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      recentOrders: [],
      totalRevenue: 0,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      title: TR.admin.totalProducts,
      value: stats.totalProducts,
      icon: Package,
      href: "/admin/urunler",
      color: "bg-blue-500",
    },
    {
      title: TR.admin.totalOrders,
      value: stats.totalOrders,
      icon: ShoppingCart,
      href: "/admin/siparisler",
      color: "bg-green-500",
    },
    {
      title: TR.admin.totalUsers,
      value: stats.totalUsers,
      icon: Users,
      href: "/admin/kullanicilar",
      color: "bg-purple-500",
    },
    {
      title: TR.admin.totalSales,
      value: formatPrice(stats.totalRevenue),
      icon: TrendingUp,
      href: "/admin/siparisler",
      color: "bg-amber-500",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-900">Dashboard</h1>
      <p className="mt-1 text-stone-600">
        Rhea Coffee yönetim paneline hoş geldiniz.
      </p>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-stone-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Son Siparişler</CardTitle>
            <Link
              href="/admin/siparisler"
              className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-800"
            >
              Tümünü Gör
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-200 text-left">
                      <th className="pb-3 text-sm font-medium text-stone-500">
                        Sipariş No
                      </th>
                      <th className="pb-3 text-sm font-medium text-stone-500">
                        Müşteri
                      </th>
                      <th className="pb-3 text-sm font-medium text-stone-500">
                        Durum
                      </th>
                      <th className="pb-3 text-right text-sm font-medium text-stone-500">
                        Tutar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {stats.recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="py-3">
                          <Link
                            href={`/admin/siparisler/${order.id}`}
                            className="font-medium text-amber-700 hover:text-amber-800"
                          >
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td className="py-3 text-stone-600">
                          {order.user.name || order.user.email}
                        </td>
                        <td className="py-3">
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
                        </td>
                        <td className="py-3 text-right font-medium">
                          {formatPrice(Number(order.total))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-stone-500 py-8">
                Henüz sipariş bulunmuyor.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
