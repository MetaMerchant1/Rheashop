import * as fs from "fs";
import * as path from "path";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

// Read .env file synchronously
const envPath = path.resolve(__dirname, "../.env");
const envContent = fs.readFileSync(envPath, "utf-8");
const envLines = envContent.split("\n");

// Parse DATABASE_URL from .env file
let DATABASE_URL = "";
for (const line of envLines) {
  if (line.startsWith("DATABASE_URL=")) {
    DATABASE_URL = line.substring("DATABASE_URL=".length).replace(/["']/g, "").trim();
    break;
  }
}

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL not found in .env file");
}

console.log("DATABASE_URL found:", DATABASE_URL.substring(0, 30) + "...");

// Create pool with standard pg adapter
const pool = new Pool({ connectionString: DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@rheacoffee.com" },
    update: {},
    create: {
      email: "admin@rheacoffee.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin user created:", admin.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "turk-kahvesi" },
      update: {},
      create: {
        name: "Türk Kahvesi",
        slug: "turk-kahvesi",
        description: "Geleneksel Türk kahvesi çeşitleri",
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "filtre-kahve" },
      update: {},
      create: {
        name: "Filtre Kahve",
        slug: "filtre-kahve",
        description: "Özenle kavrulmuş filtre kahve çekirdekleri",
        order: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "espresso" },
      update: {},
      create: {
        name: "Espresso",
        slug: "espresso",
        description: "Espresso için özel harmanlar",
        order: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "aksesuarlar" },
      update: {},
      create: {
        name: "Aksesuarlar",
        slug: "aksesuarlar",
        description: "Kahve aksesuarları ve ekipmanları",
        order: 4,
      },
    }),
  ]);
  console.log("Categories created:", categories.length);

  // Create products
  const products = [
    {
      name: "Rhea Özel Harman Türk Kahvesi",
      slug: "rhea-ozel-harman-turk-kahvesi",
      description:
        "Özenle seçilmiş Brezilya ve Etiyopya çekirdeklerinden hazırlanan özel harmanımız. Yoğun aroması ve uzun süren tadıyla öne çıkar.",
      shortDesc: "Özel harman, yoğun aroma",
      price: 149.9,
      sku: "TK-001",
      stock: 50,
      weight: 250,
      roastLevel: "Orta Kavurma",
      origin: "Brezilya & Etiyopya",
      flavorNotes: ["Çikolata", "Fındık", "Karamel"],
      categoryId: categories[0].id,
      isFeatured: true,
    },
    {
      name: "Damla Sakızlı Türk Kahvesi",
      slug: "damla-sakizli-turk-kahvesi",
      description:
        "Geleneksel tarifle hazırlanan damla sakızlı Türk kahvesi. Damla sakızının eşsiz aroması ile kahvenin muhteşem uyumu.",
      shortDesc: "Damla sakızlı, geleneksel tat",
      price: 179.9,
      sku: "TK-002",
      stock: 30,
      weight: 250,
      roastLevel: "Orta Kavurma",
      origin: "Brezilya",
      flavorNotes: ["Damla Sakızı", "Vanilya"],
      categoryId: categories[0].id,
      isFeatured: true,
    },
    {
      name: "Ethiopia Yirgacheffe",
      slug: "ethiopia-yirgacheffe",
      description:
        "Etiyopya'nın Yirgacheffe bölgesinden gelen bu kahve, çiçeksi ve meyvemsi notalarıyla ünlüdür. Hafif ve zarif bir içim sunar.",
      shortDesc: "Çiçeksi, meyvemsi notalar",
      price: 249.9,
      sku: "FK-001",
      stock: 25,
      weight: 250,
      roastLevel: "Açık Kavurma",
      origin: "Etiyopya",
      flavorNotes: ["Yasemin", "Bergamot", "Limon"],
      categoryId: categories[1].id,
      isFeatured: true,
    },
    {
      name: "Colombia Supremo",
      slug: "colombia-supremo",
      description:
        "Kolombiya'nın en kaliteli kahve çekirdekleri. Dengeli asidite ve karamel tadı ile mükemmel bir fincan kahve.",
      shortDesc: "Dengeli, karamel tadı",
      price: 219.9,
      sku: "FK-002",
      stock: 40,
      weight: 250,
      roastLevel: "Orta Kavurma",
      origin: "Kolombiya",
      flavorNotes: ["Karamel", "Fındık", "Portakal"],
      categoryId: categories[1].id,
      isFeatured: true,
    },
    {
      name: "Rhea Espresso Blend",
      slug: "rhea-espresso-blend",
      description:
        "Espresso için özel olarak hazırlanmış harmanımız. Yoğun krema, dolgun gövde ve tatlı bitişiyle espresso tutkunları için ideal.",
      shortDesc: "Yoğun krema, dolgun gövde",
      price: 199.9,
      sku: "ES-001",
      stock: 60,
      weight: 250,
      roastLevel: "Koyu Kavurma",
      origin: "Brezilya & Guatemala",
      flavorNotes: ["Bitter Çikolata", "Fındık", "Bal"],
      categoryId: categories[2].id,
      isFeatured: true,
    },
    {
      name: "Single Origin Brazil Santos",
      slug: "single-origin-brazil-santos",
      description:
        "Brezilya Santos bölgesinden tek kökenli kahve. Düşük asidite, yumuşak içim ve çikolatalı son.",
      shortDesc: "Yumuşak, çikolatalı",
      price: 189.9,
      salePrice: 159.9,
      sku: "ES-002",
      stock: 35,
      weight: 250,
      roastLevel: "Orta-Koyu Kavurma",
      origin: "Brezilya",
      flavorNotes: ["Çikolata", "Ceviz", "Karamel"],
      categoryId: categories[2].id,
      isFeatured: false,
    },
  ];

  for (const productData of products) {
    const { categoryId, ...data } = productData;
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        category: { connect: { id: categoryId } },
      },
    });
  }
  console.log("Products created:", products.length);

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
