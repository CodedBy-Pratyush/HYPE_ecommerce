// Run with: npm run seed
// This fills the database with sample products and one admin account,
// so the homepage has something to show right away.
require("dotenv").config();

const connectDB = require("./config/db");
const User = require("./models/User");
const Product = require("./models/Product");

const products = [
  { name: "Aurora Linen Shirt", description: "Premium relaxed linen shirt", price: 1299, category: "Clothing", stock: 20, image: "https://images.unsplash.com/photo-1603252109303-2751441dd157" },
  { name: "Noir Leather Bag", description: "Minimal everyday leather bag", price: 2499, category: "Bags", stock: 12, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa" },
  { name: "Classic Watch", description: "Elegant everyday wrist watch", price: 3499, category: "Accessories", stock: 8, image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d" },
  { name: "Urban Sneakers", description: "Comfortable premium sneakers", price: 2999, category: "Footwear", stock: 15, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff" },
  { name: "Silk Evening Dress", description: "Modern evening silhouette", price: 4999, category: "Clothing", stock: 7, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae" },
  { name: "Everyday Tote", description: "Structured spacious tote", price: 1899, category: "Bags", stock: 18, image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c" },
  { name: "Minimal Sunglasses", description: "Clean frame sunglasses", price: 999, category: "Accessories", stock: 25, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083" },
  { name: "Leather Loafers", description: "Classic leather loafers", price: 2799, category: "Footwear", stock: 10, image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509" },
];

async function seed() {
  try {
    await connectDB();

    // Clear old products and insert the fresh sample list.
    await Product.deleteMany({});
    await Product.insertMany(products);

    // Create (or reset) the admin account.
    const email = process.env.SEED_ADMIN_EMAIL || "admin@hype.com";
    let admin = await User.findOne({ email });

    if (!admin) {
      admin = new User({
        name: "HYPE Admin",
        email,
        password: process.env.SEED_ADMIN_PASSWORD || "Admin@12345",
        role: "admin",
      });
    } else {
      admin.name = "HYPE Admin";
      admin.password = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";
      admin.role = "admin";
    }

    await admin.save();

    console.log("Seed complete!");
    console.log(`Products added: ${products.length}`);
    console.log(`Admin login: ${email} / ${process.env.SEED_ADMIN_PASSWORD || "Admin@12345"}`);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
