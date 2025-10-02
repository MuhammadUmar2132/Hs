const Product = require("../models/product.model");
const cloudinary = require("../config/cloudinary");

// ✅ Upload helper
const uploadToCloudinary = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, { folder: "products" });
};

// ✅ Create Product
exports.createProduct = async (req, res) => {
  try {
    let uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await uploadToCloudinary(file.path);
        uploadedImages.push({ url: result.secure_url, public_id: result.public_id });
      }
    }

    const product = new Product({ ...req.body, images: uploadedImages });
    await product.save();

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Products
exports.getProducts = async (req, res) => {
  try {
    const { category, isNew, isBestSelling } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (isNew) filter.isNew = isNew === "true";
    if (isBestSelling) filter.isBestSelling = isBestSelling === "true";

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Product By ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Product
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Upload new images if provided
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      for (let img of product.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      for (let file of req.files) {
        const result = await uploadToCloudinary(file.path);
        uploadedImages.push({ url: result.secure_url, public_id: result.public_id });
      }
    } else {
      uploadedImages = product.images; // keep old images if none uploaded
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images: uploadedImages },
      { new: true }
    );

    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // delete images from Cloudinary
    for (let img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
