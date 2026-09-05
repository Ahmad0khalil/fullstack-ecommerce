import { productService } from "../services/product.service.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Call the service with all query params
    const { items, total } = await productService.findAll(req.query);

    // Use the standard structure: (status, data, message, meta)
    return res.status(200).json(
      new ApiResponse(
        200, 
        items, 
        "Products fetched successfully", 
        {
          totalCount: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        }
      )
    );
  } catch (err) {
    // Let the global error handler deal with the 500 response structure
    next(err);
  }
};

export const addNewproduct = async (req, res, next) => {
  try {
    const product = await productService.create(req.body);
    return res.status(201).json(
      new ApiResponse(201, product, "Product created successfully")
    );
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json(new ApiResponse(400, null, "SKU already exists"));
    }
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.findById(req.params.id);
    if (!product) {
      return res.status(404).json(new ApiResponse(404, null, "Product not found"));
    }
    return res.status(200).json(
      new ApiResponse(200, product, "Product retrieved successfully")
    );
  } catch (err) {
    next(err);
  }
};

export const editProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!Object.keys(req.body).length) {
      return res.status(400).json(new ApiResponse(400, null, "No fields to update"));
    }

    const updatedProduct = await productService.update(id, req.body);
    if (!updatedProduct) {
      return res.status(404).json(new ApiResponse(404, null, "Product not found"));
    }

    return res.status(200).json(
      new ApiResponse(200, updatedProduct, "Product updated successfully")
    );
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json(new ApiResponse(400, null, "SKU already exists"));
    }
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await productService.remove(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json(new ApiResponse(404, null, "Product not found"));
    }
    return res.status(200).json(
      new ApiResponse(200, deletedProduct, "Product deleted successfully")
    );
  } catch (err) {
    next(err);
  }
};
