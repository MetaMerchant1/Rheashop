import Link from "next/link";
import Image from "next/image";
import { Plus, Package, Edit, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Button, Card, CardContent, Badge } from "@/components/ui";

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return products;
  } catch {
    return [];
  }
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Ürünler</h1>
          <p className="mt-1 text-stone-600">
            Toplam {products.length} ürün
          </p>
        </div>
        <Link href="/admin/urunler/yeni">
          <Button>
            <Plus className="mr-2 h-5 w-5" />
            Yeni Ürün
          </Button>
        </Link>
      </div>

      <Card className="mt-8">
        <CardContent className="p-0">
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-stone-500">
                      Ürün
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-stone-500">
                      Kategori
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-stone-500">
                      Fiyat
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-stone-500">
                      Stok
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-stone-500">
                      Durum
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-stone-500">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-stone-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-stone-100">
                            {product.images[0]?.url ? (
                              <Image
                                src={product.images[0].url}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Package className="h-5 w-5 text-stone-300" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-stone-900">
                              {product.name}
                            </p>
                            <p className="text-sm text-stone-500">
                              SKU: {product.sku}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-stone-600">
                        {product.category.name}
                      </td>
                      <td className="px-6 py-4">
                        {product.salePrice ? (
                          <div>
                            <span className="font-medium text-amber-700">
                              {formatPrice(Number(product.salePrice))}
                            </span>
                            <span className="ml-2 text-sm text-stone-400 line-through">
                              {formatPrice(Number(product.price))}
                            </span>
                          </div>
                        ) : (
                          <span className="font-medium text-stone-900">
                            {formatPrice(Number(product.price))}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            product.stock > 10
                              ? "success"
                              : product.stock > 0
                              ? "warning"
                              : "error"
                          }
                        >
                          {product.stock} adet
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={product.isActive ? "success" : "default"}>
                          {product.isActive ? "Aktif" : "Pasif"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/urunler/${product.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-stone-300" />
              <p className="mt-4 text-stone-600">Henüz ürün bulunmuyor.</p>
              <Link href="/admin/urunler/yeni" className="mt-4 inline-block">
                <Button>
                  <Plus className="mr-2 h-5 w-5" />
                  İlk Ürünü Ekle
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
