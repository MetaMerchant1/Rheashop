import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Coffee, Truck, Award, Leaf } from "lucide-react";
import { Button } from "@/components/ui";
import { ProductCard } from "@/components/products/ProductCard";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering to fetch data at request time
export const dynamic = "force-dynamic";

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      include: {
        category: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    });
    return products;
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 4,
    });
    return categories;
  } catch {
    return [];
  }
}

const features = [
  {
    icon: Coffee,
    title: "Taze Kavurma",
    description: "Siparişinize özel taze kavrulmuş kahveler",
  },
  {
    icon: Truck,
    title: "Hızlı Teslimat",
    description: "250 TL üzeri siparişlerde ücretsiz kargo",
  },
  {
    icon: Award,
    title: "Premium Kalite",
    description: "En kaliteli çekirdeklerden özenle seçilmiş",
  },
  {
    icon: Leaf,
    title: "Sürdürülebilir",
    description: "Çevre dostu ve etik kaynaklı kahveler",
  },
];

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-stone-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 to-stone-900/70" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Eşsiz Kahve Deneyimi
            </h1>
            <p className="mt-6 text-lg text-stone-300">
              Dünyanın en seçkin kahve çekirdeklerinden hazırlanan özel harman
              kahvelerimizle tanışın. Her yudumda kaliteyi hissedin.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/urunler">
                <Button size="lg" className="w-full sm:w-auto">
                  Alışverişe Başla
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/hakkimizda">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-white text-white hover:bg-white hover:text-stone-900 sm:w-auto"
                >
                  Hikayemiz
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-stone-200 bg-stone-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                  <feature.icon className="h-6 w-6 text-amber-700" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-stone-900">
                  {feature.title}
                </h3>
                <p className="mt-1 text-xs text-stone-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
                Kategoriler
              </h2>
              <p className="mt-2 text-stone-600">
                Damak zevkinize uygun kahveyi bulun
              </p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/urunler?kategori=${category.slug}`}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-stone-100"
                >
                  {category.image && (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-semibold text-white">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="bg-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
                Öne Çıkan Ürünler
              </h2>
              <p className="mt-2 text-stone-600">
                En çok tercih edilen kahvelerimiz
              </p>
            </div>
            <Link
              href="/urunler"
              className="hidden text-sm font-medium text-amber-700 hover:text-amber-800 sm:flex sm:items-center"
            >
              Tümünü Gör
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: Number(product.price),
                    salePrice: product.salePrice
                      ? Number(product.salePrice)
                      : null,
                    image: product.images[0]?.url || null,
                    stock: product.stock,
                    category: product.category.name,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-stone-200 bg-white p-12 text-center">
              <Coffee className="mx-auto h-12 w-12 text-stone-300" />
              <p className="mt-4 text-stone-600">
                Henüz öne çıkan ürün bulunmuyor.
              </p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/urunler">
              <Button variant="outline">
                Tüm Ürünleri Gör
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-amber-700 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Kahve Dünyasına Adım Atın
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-amber-100">
            Özel indirimlerden ve yeni ürünlerden haberdar olmak için bültenimize
            abone olun.
          </p>
          <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 rounded-lg border-0 px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-white"
            />
            <Button
              type="submit"
              className="bg-stone-900 text-white hover:bg-stone-800"
            >
              Abone Ol
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
