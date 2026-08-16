const mongoose = require("mongoose");

// Each order stores a SNAPSHOT of the product info (name, price, image)
// at the time of purchase, so it stays correct even if the product
// is later edited or deleted.
const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    image: String,
    price: Number,
    quantity: { type: Number, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], required: true },
    shippingAddress: {
      name: String,
      address: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phone: String, // contact number for delivery
    },
    paymentMethod: { type: String, default: "COD" },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
