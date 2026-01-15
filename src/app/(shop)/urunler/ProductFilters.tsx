"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory?: string;
  selectedSort?: string;
  mobile?: boolean;
}

const sortOptions = [
  { value: "newest", label: "En Yeni" },
  { value: "price-asc", label: "Fiyat: Düşükten Yükseğe" },
  { value: "price-desc", label: "Fiyat: Yüksekten Düşüğe" },
  { value: "name-asc", label: "İsim: A-Z" },
];

export function ProductFilters({
  categories,
  selectedCategory,
  selectedSort = "newest",
  mobile = false,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/urunler?${params.toString()}`);
  };

  if (mobile) {
    return (
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtrele
        </Button>

        <select
          value={selectedSort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {mobileFiltersOpen && (
          <div className="absolute left-0 right-0 top-full z-10 mt-2 rounded-xl border border-stone-200 bg-white p-4 shadow-lg">
            <h3 className="font-medium text-stone-900">Kategoriler</h3>
            <div className="mt-2 space-y-1">
              <button
                onClick={() => {
                  updateFilter("kategori", null);
                  setMobileFiltersOpen(false);
                }}
                className={cn(
                  "block w-full rounded-lg px-3 py-2 text-left text-sm",
                  !selectedCategory
                    ? "bg-amber-50 text-amber-700"
                    : "text-stone-700 hover:bg-stone-50"
                )}
              >
                Tümü
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    updateFilter("kategori", category.slug);
                    setMobileFiltersOpen(false);
                  }}
                  className={cn(
                    "block w-full rounded-lg px-3 py-2 text-left text-sm",
                    selectedCategory === category.slug
                      ? "bg-amber-50 text-amber-700"
                      : "text-stone-700 hover:bg-stone-50"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-stone-900">Kategoriler</h3>
        <div className="mt-3 space-y-1">
          <button
            onClick={() => updateFilter("kategori", null)}
            className={cn(
              "block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
              !selectedCategory
                ? "bg-amber-50 text-amber-700 font-medium"
                : "text-stone-700 hover:bg-stone-50"
            )}
          >
            Tüm Ürünler
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => updateFilter("kategori", category.slug)}
              className={cn(
                "block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                selectedCategory === category.slug
                  ? "bg-amber-50 text-amber-700 font-medium"
                  : "text-stone-700 hover:bg-stone-50"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-sm font-semibold text-stone-900">Sıralama</h3>
        <div className="mt-3 space-y-1">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateFilter("sort", option.value)}
              className={cn(
                "block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                selectedSort === option.value
                  ? "bg-amber-50 text-amber-700 font-medium"
                  : "text-stone-700 hover:bg-stone-50"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
