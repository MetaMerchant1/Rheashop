import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, MapPin, Settings, LogOut } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, Button } from "@/components/ui";
import { TR } from "@/lib/constants";

async function getUserStats(userId: string) {
  const orderCount = await prisma.order.count({
    where: { userId },
  });
  const addressCount = await prisma.address.count({
    where: { userId },
  });
  return { orderCount, addressCount };
}

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/giris");
  }

  const stats = await getUserStats(session.user.id);

  const menuItems = [
    {
      title: TR.account.orders,
      description: `${stats.orderCount} sipariş`,
      icon: Package,
      href: "/hesabim/siparislerim",
    },
    {
      title: TR.account.addresses,
      description: `${stats.addressCount} kayıtlı adres`,
      icon: MapPin,
      href: "/hesabim/adreslerim",
    },
    {
      title: TR.account.settings,
      description: "Profil ve güvenlik",
      icon: Settings,
      href: "/hesabim/ayarlar",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">{TR.account.myAccount}</h1>
        <p className="mt-2 text-stone-600">
          Hoş geldiniz, {session.user.name || session.user.email}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Link key={item.title} href={item.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                  <item.icon className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-medium text-stone-900">{item.title}</h3>
                  <p className="text-sm text-stone-500">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button variant="outline" type="submit" className="text-red-600">
            <LogOut className="mr-2 h-5 w-5" />
            {TR.account.logout}
          </Button>
        </form>
      </div>
    </div>
  );
}
