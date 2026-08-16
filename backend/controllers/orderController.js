const Order = require("../models/Order");
const Product = require("../models/Product");

// POST /api/orders — must be logged in
exports.create = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod = "COD" } = req.body;

    if (!items?.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;
    const orderItems = [];

    // Check stock and build the order line by line.
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      total += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      });
    }

    // Reduce stock for each purchased product.
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      total,
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/mine — the logged-in user's own orders
exports.mine = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/admin/all — ADMIN ONLY
exports.all = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/orders/admin/:id/status — ADMIN ONLY
exports.status = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = req.body.status;
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};
