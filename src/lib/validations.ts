import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-posta adresi gerekli")
    .email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(1, "Şifre gerekli"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Ad soyad en az 2 karakter olmalı"),
    email: z
      .string()
      .min(1, "E-posta adresi gerekli")
      .email("Geçerli bir e-posta adresi girin"),
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalı")
      .regex(/[A-Z]/, "Şifre en az bir büyük harf içermeli")
      .regex(/[0-9]/, "Şifre en az bir rakam içermeli"),
    confirmPassword: z.string().min(1, "Şifre tekrarı gerekli"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

export const addressSchema = z.object({
  title: z.string().min(1, "Başlık gerekli"),
  firstName: z.string().min(2, "Ad en az 2 karakter olmalı"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalı"),
  phone: z
    .string()
    .regex(/^(\+90|0)?5\d{9}$/, "Geçerli bir telefon numarası girin"),
  address: z.string().min(10, "Adres en az 10 karakter olmalı"),
  city: z.string().min(2, "İl seçimi gerekli"),
  district: z.string().min(2, "İlçe seçimi gerekli"),
  postalCode: z.string().length(5, "Posta kodu 5 haneli olmalı"),
  isDefault: z.boolean().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Ürün adı en az 2 karakter olmalı"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalı"),
  shortDesc: z.string().optional(),
  price: z.number().positive("Fiyat pozitif olmalı"),
  salePrice: z.number().positive().optional().nullable(),
  sku: z.string().min(1, "Ürün kodu gerekli"),
  stock: z.number().int().min(0, "Stok negatif olamaz"),
  weight: z.number().int().positive().optional().nullable(),
  roastLevel: z.string().optional().nullable(),
  origin: z.string().optional().nullable(),
  flavorNotes: z.array(z.string()).optional(),
  categoryId: z.string().min(1, "Kategori seçimi gerekli"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5, "Puan 1-5 arasında olmalı"),
  title: z.string().optional(),
  comment: z.string().optional(),
});

export const couponSchema = z.object({
  code: z.string().min(3, "Kupon kodu en az 3 karakter olmalı").toUpperCase(),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().positive("İndirim değeri pozitif olmalı"),
  minOrderValue: z.number().positive().optional().nullable(),
  maxUses: z.number().int().positive().optional().nullable(),
  isActive: z.boolean().default(true),
  startsAt: z.date().optional().nullable(),
  expiresAt: z.date().optional().nullable(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
