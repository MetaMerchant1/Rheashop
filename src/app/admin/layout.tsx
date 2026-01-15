import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  LogOut,
} from "lucide-react";
import { auth, signOut } from "@/lib/auth";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Ürünler", href: "/admin/urunler", icon: Package },
  { name: "Siparişler", href: "/admin/siparisler", icon: ShoppingCart },
  { name: "Kullanıcılar", href: "/admin/kullanicilar", icon: Users },
  { name: "Kategoriler", href: "/admin/kategoriler", icon: Tag },
  { name: "Ayarlar", href: "/admin/ayarlar", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/giris");
  }

  return (
    <div className="flex min-h-screen bg-stone-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-stone-900 text-white">
        <div className="flex h-16 items-center gap-2 border-b border-stone-800 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600">
            <span className="text-sm font-bold">R</span>
          </div>
          <span className="font-bold">Rhea Admin</span>
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-300 hover:bg-stone-800 hover:text-white transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-stone-800 p-4">
          <div className="mb-3 text-sm text-stone-400">
            {session.user.name || session.user.email}
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-300 hover:bg-stone-800 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Çıkış Yap
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="min-h-screen p-8">{children}</div>
      </main>
    </div>
  );
}
