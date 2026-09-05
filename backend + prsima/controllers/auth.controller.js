import { authService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res, next) => {
  try {
    const user = await authService.createUser(req.body);
    return res.status(201).json(
      new ApiResponse(201, user, "User registered successfully")
    );
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const authData = await authService.authenticateUser(email, password);

    if (!authData) {
      return res.status(401).json(
        new ApiResponse(401, null, "Invalid email or password")
      );
    }

    const { token, user } = authData;

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json(
      new ApiResponse(200, { user, token }, "Login successful")
    );
  } catch (err) {
    next(err);
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json(
    new ApiResponse(200, null, "Logout successful")
  );
};

export const getCurrentUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json(
        new ApiResponse(401, null, "No session found")
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json(
      new ApiResponse(200, decoded, "Current user retrieved")
    );
  } catch (err) {
    next(err);
  }
};