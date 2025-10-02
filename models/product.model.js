const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Switch Plates", "Lights", "Fans", "Cables", "Pipes and Ducts", "Breakers"],
      required: true,
    },
    subCategory: { type: String },
    model: { type: String },
    color: [String],
    size: [String],
    type: { type: String },
    watts: [Number],
    pole: [String],
    phase: { type: String, enum: ["SINGLE", "THREE-PHASE"] },
    brand: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    quantityType: { type: String, enum: ["Coil", "Guz"], default: "Coil" },

    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    // Categorization
    isNew: { type: Boolean, default: false },
    isBestSelling: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
