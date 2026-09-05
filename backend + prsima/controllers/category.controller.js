import { categoryService } from '../services/category.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.findAll();
    return res.status(200).json(
      new ApiResponse(200, categories, "Categories retrieved successfully")
    );
  } catch (err) {
    next(err);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.findById(req.params.id);
    if (!category) {
      return res.status(404).json(new ApiResponse(404, null, "Category not found"));
    }
    return res.status(200).json(
      new ApiResponse(200, category, "Category details found")
    );
  } catch (err) {
    next(err);
  }
};

export const postCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const newCategory = await categoryService.create(name);
    return res.status(201).json(
      new ApiResponse(201, newCategory, "Category created successfully")
    );
  } catch (err) {
    next(err);
  }
};

export const editCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const updatedCategory = await categoryService.update(req.params.id, name);
    
    if (!updatedCategory) {
      return res.status(404).json(new ApiResponse(404, null, "Category not found"));
    }

    return res.status(200).json(
      new ApiResponse(200, updatedCategory, "Category updated successfully")
    );
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const deletedCategory = await categoryService.remove(req.params.id);
    
    if (!deletedCategory) {
      return res.status(404).json(new ApiResponse(404, null, "Category not found"));
    }

    return res.status(200).json(
      new ApiResponse(200, deletedCategory, "Category deleted successfully")
    );
  } catch (err) {
    next(err);
  }
};