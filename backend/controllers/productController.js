const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");
const { cloudinary, configured } = require("../config/cloudinary");

// Saves an uploaded image either to Cloudinary (if configured) or
// to a local /uploads folder, and returns { url, publicId }.
async function uploadImage(file) {
  if (!file) return null;

  if (configured) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: "hype/products" }, (err, result) => {
        if (err) return reject(err);
        resolve({ url: result.secure_url, publicId: result.public_id });
      });
      stream.end(file.buffer);
    });
  }

  const uploadsDir = path.join(__dirname, "../uploads");
  fs.mkdirSync(uploadsDir, { recursive: true });

  const extension = path.extname(file.originalname) || ".jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`;
  fs.writeFileSync(path.join(uploadsDir, fileName), file.buffer);

  return { url: `/uploads/${fileName}`, publicId: "" };
}

// Deletes a product's image (from Cloudinary or the local folder) when
// the product is updated with a new image, or deleted entirely.
async function deleteImage(product) {
  if (configured && product.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(product.imagePublicId);
    } catch (err) {
      // Not critical if this fails — the DB record is what matters most.
    }
  } else if (product.image?.startsWith("/uploads/")) {
    try {
      fs.unlinkSync(path.join(__dirname, "..", product.image));
    } catch (err) {
      // File may already be gone — that's fine.
    }
  }
}

// GET /api/products
// Public route — no login needed. Powers the Home page and Shop page.
exports.list = async (req, res, next) => {
  try {
    const { search = "", category = "", sort = "", page = 1, limit = 12 } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category) filter.category = category;

    let sortOrder = { createdAt: -1 }; // newest first, by default
    if (sort === "price_asc") sortOrder = { price: 1 };
    if (sort === "price_desc") sortOrder = { price: -1 };
    if (sort === "name_asc") sortOrder = { name: 1 };

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Number(limit) || 12);

    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOrder)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    res.json({
      success: true,
      products,
      totalProducts,
      totalPages: Math.max(1, Math.ceil(totalProducts / pageSize)),
      currentPage: pageNumber,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/categories — public, used for the filter dropdown
exports.categories = async (req, res, next) => {
  try {
    const categories = await Product.distinct("category");
    res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id — public, used on the product details page
exports.one = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// POST /api/products — ADMIN ONLY (see productRoutes.js)
exports.create = async (req, res, next) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, description, price and category are required",
      });
    }

    const image = await uploadImage(req.file);
    if (!image) {
      return res.status(400).json({ success: false, message: "Product image is required" });
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock) || 0,
      image: image.url,
      imagePublicId: image.publicId,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id — ADMIN ONLY
exports.update = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    ["name", "description", "price", "category", "stock"].forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] =
          field === "price" || field === "stock" ? Number(req.body[field]) : req.body[field];
      }
    });

    // Only replace the image if a new one was uploaded.
    if (req.file) {
      await deleteImage(product);
      const image = await uploadImage(req.file);
      product.image = image.url;
      product.imagePublicId = image.publicId;
    }

    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id — ADMIN ONLY
exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await deleteImage(product);
    await product.deleteOne();

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};
