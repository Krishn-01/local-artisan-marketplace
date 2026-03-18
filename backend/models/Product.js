const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // ============================
    // Basic Product Fields
    // ============================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    // ============================
    // Extra Product Details
    // ============================
    story: {
      type: String,
      default: "",
    },

    hashtags: {
      type: String,
      default: "",
    },

    // ============================
    // Product Image (Base64 or URL)
    // ============================
    image: {
      type: String,
      default: "",
    },

    // ============================
    // Artisan Info
    // ============================
    artisan: {
      name: {
        type: String,
        default: "Local Artisan",
      },

      email: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true, // auto adds createdAt + updatedAt
  }
);

module.exports = mongoose.model("Product", productSchema);
