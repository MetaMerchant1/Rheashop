import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ShoppingBag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { AddToCartButton } from "./AddToCartButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { name: true, image: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
    return product;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Ürün Bulunamadı" };
  }

  return {
    title: product.name,
    description: product.shortDesc || product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDesc || product.description.slice(0, 160),
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const isOnSale = product.salePrice && Number(product.salePrice) < Number(product.price);
  const discount = isOnSale
    ? Math.round(
        ((Number(product.price) - Number(product.salePrice!)) /
          Number(product.price)) *
          100
      )
    : 0;

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-stone-500">
        <Link href="/" className="hover:text-amber-700">
          Ana Sayfa
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/urunler" className="hover:text-amber-700">
          Ürünler
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/urunler?kategori=${product.category.slug}`}
          className="hover:text-amber-700"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-stone-900">{product.name}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-100">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ShoppingBag className="h-24 w-24 text-stone-300" />
              </div>
            )}
            {isOnSale && (
              <Badge variant="error" className="absolute left-4 top-4 text-sm">
                %{discount} İndirim
              </Badge>
            )}
          </div>

          {/* Thumbnail gallery */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square overflow-hidden rounded-lg bg-stone-100"
                >
                  <Image
                    src={image.url}
                    alt={image.alt || product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-8 lg:mt-0">
          <div className="mb-4">
            <Link
              href={`/urunler?kategori=${product.category.slug}`}
              className="text-sm font-medium text-amber-700 hover:text-amber-800"
            >
              {product.category.name}
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-stone-900">{product.name}</h1>

          {/* Price */}
          <div className="mt-4 flex items-center gap-3">
            {isOnSale ? (
              <>
                <span className="text-3xl font-bold text-amber-700">
                  {formatPrice(Number(product.salePrice))}
                </span>
                <span className="text-xl text-stone-400 line-through">
                  {formatPrice(Number(product.price))}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-stone-900">
                {formatPrice(Number(product.price))}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mt-4">
            {product.stock > 0 ? (
              <Badge variant="success">Stokta Var ({product.stock} adet)</Badge>
            ) : (
              <Badge variant="error">Stokta Yok</Badge>
            )}
          </div>

          {/* Short Description */}
          {product.shortDesc && (
            <p className="mt-6 text-stone-600">{product.shortDesc}</p>
          )}

          {/* Product Details */}
          <div className="mt-6 space-y-3 border-t border-stone-200 pt-6">
            {product.roastLevel && (
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Kavurma Derecesi</span>
                <span className="font-medium text-stone-900">
                  {product.roastLevel}
                </span>
              </div>
            )}
            {product.origin && (
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Menşei</span>
                <span className="font-medium text-stone-900">
                  {product.origin}
                </span>
              </div>
            )}
            {product.weight && (
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Ağırlık</span>
                <span className="font-medium text-stone-900">
                  {product.weight}g
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Ürün Kodu</span>
              <span className="font-medium text-stone-900">{product.sku}</span>
            </div>
          </div>

          {/* Flavor Notes */}
          {product.flavorNotes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-stone-900">Tat Notaları</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.flavorNotes.map((note) => (
                  <Badge key={note} variant="default">
                    {note}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="mt-8">
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.price),
                salePrice: product.salePrice ? Number(product.salePrice) : null,
                image: primaryImage?.url || "",
                stock: product.stock,
              }}
            />
          </div>

          {/* Description */}
          <div className="mt-8 border-t border-stone-200 pt-8">
            <h2 className="text-lg font-semibold text-stone-900">
              Ürün Açıklaması
            </h2>
            <div
              className="prose prose-stone mt-4 max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
