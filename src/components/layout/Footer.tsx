import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

const footerLinks = {
  shop: [
    { name: "Tüm Ürünler", href: "/urunler" },
    { name: "Yeni Gelenler", href: "/urunler?sort=newest" },
    { name: "Çok Satanlar", href: "/urunler?sort=bestseller" },
    { name: "İndirimli Ürünler", href: "/urunler?sale=true" },
  ],
  company: [
    { name: "Hakkımızda", href: "/hakkimizda" },
    { name: "İletişim", href: "/iletisim" },
    { name: "Blog", href: "/blog" },
    { name: "Kariyer", href: "/kariyer" },
  ],
  support: [
    { name: "Sıkça Sorulan Sorular", href: "/sss" },
    { name: "Kargo ve Teslimat", href: "/kargo-teslimat" },
    { name: "İade ve Değişim", href: "/iade-degisim" },
    { name: "Sipariş Takip", href: "/siparis-takip" },
  ],
  legal: [
    { name: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
    { name: "Kullanım Koşulları", href: "/kullanim-kosullari" },
    { name: "KVKK", href: "/kvkk" },
  ],
};

const socialLinks = [
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "Twitter", href: "#", icon: Twitter },
];

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-700">
                <span className="text-xl font-bold text-white">R</span>
              </div>
              <span className="text-xl font-bold text-stone-900">
                Rhea Coffee
              </span>
            </Link>
            <p className="mt-4 text-sm text-stone-600">
              En kaliteli kahve çekirdekleriyle hazırlanan özel harman kahveler.
              Evinize taze kahve keyfi getiriyoruz.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-stone-500 hover:text-amber-700 transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-stone-900">Mağaza</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.shop.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-stone-600 hover:text-amber-700 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-stone-900">Kurumsal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-stone-600 hover:text-amber-700 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-stone-900">Destek</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-stone-600 hover:text-amber-700 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-stone-900">Yasal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-stone-600 hover:text-amber-700 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-stone-200 pt-8">
          <p className="text-center text-sm text-stone-500">
            &copy; {new Date().getFullYear()} Rhea Coffee. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
