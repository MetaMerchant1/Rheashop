import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/ui";
import { ProductFilters } from "./ProductFilters";

interface PageProps {
  searchParams: Promise<{
    kategori?: string;
    sort?: string;
    q?: string;
  }>;
}

async function getProducts(params: {
  kategori?: string;
  sort?: string;
  q?: string;
}) {
  const { kategori, sort, q } = params;

  const where: {
    isActive: boolean;
    category?: { slug: string };
    OR?: { name: { contains: string; mode: "insensitive" } }[];
  } = {
    isActive: true,
  };

  if (kategori) {
    where.category = { slug: kategori };
  }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
    ];
  }

  let orderBy: { [key: string]: "asc" | "desc" } = { createdAt: "desc" };

  switch (sort) {
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "name-asc":
      orderBy = { name: "asc" };
      break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
  }

  try {
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy,
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
    });
    return categories;
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Ürünler",
  description: "Rhea Coffee ürün kataloğu. En kaliteli kahve çekirdekleri ve harmanlar.",
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  const currentCategory = categories.find((c) => c.slug === params.kategori);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6">
        <h1 className="text-3xl font-bold text-stone-900">
          {currentCategory ? currentCategory.name : "Tüm Ürünler"}
        </h1>
        {currentCategory?.description && (
          <p className="mt-2 text-stone-600">{currentCategory.description}</p>
        )}
        <p className="mt-2 text-sm text-stone-500">
          {products.length} ürün bulundu
        </p>
      </div>

      <div className="mt-6 lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Filters - Sidebar */}
        <aside className="hidden lg:block">
          <ProductFilters
            categories={categories}
            selectedCategory={params.kategori}
            selectedSort={params.sort}
          />
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Mobile Filters */}
          <div className="mb-6 lg:hidden">
            <ProductFilters
              categories={categories}
              selectedCategory={params.kategori}
              selectedSort={params.sort}
              mobile
            />
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            {products.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {products.map((product) => (
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
              <div className="rounded-xl border border-stone-200 bg-white p-12 text-center">
                <p className="text-lg font-medium text-stone-900">
                  Ürün bulunamadı
                </p>
                <p className="mt-2 text-stone-600">
                  Farklı bir filtre deneyebilirsiniz.
                </p>
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
