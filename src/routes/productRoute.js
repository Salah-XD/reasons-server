import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.js";

import { createCategory,getCategories,getCategoryById,updateCategory,deleteCategory } from "../controllers/category.js";

import { addReview,updateReview,deleteReview } from "../controllers/review.js";

import { addToCart,removeCartItem,getCartItems,updateCartItem } from "../controllers/cart.js";

import { addToWishlist,removeFromWishlist,getWishlist,clearWishlist } from "../controllers/wishlist.js";

import { createAddress,getUserAddresses,getAddressById,updateAddress,deleteAddress } from "../controllers/address.js";

import { createOrder,getOrderDetails,updateOrderStatus,updateShippingStatus,getUserOrders } from "../controllers/order.js";

import { getProfile,updateProfile,deleteProfile } from "../controllers/profile.js";

//middleware imports

import { authenticateUser } from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/products", createProduct);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);



router.post("/category", createCategory);
router.get("/category", getCategories);
router.get("/category/:id", getCategoryById);
router.put("/category/:id", updateCategory);
router.delete("/category/:id", deleteCategory);


router.post("/review",authenticateUser,addReview)
router.put("/review/:reviewId",authenticateUser,updateReview)
router.delete("/review/:reviewId",authenticateUser,deleteReview)

router.post("/cart", authenticateUser, addToCart);     
router.get("/cart", authenticateUser, getCartItems);
router.put("/cart/:cartItemId", authenticateUser, updateCartItem);
router.delete("/cart/:cartItemId", authenticateUser, removeCartItem);

router.post("/wishlist", authenticateUser, addToWishlist);     
router.get("/wishlist", authenticateUser, getWishlist);
router.delete("/wishlist", authenticateUser, removeFromWishlist);
router.delete("/clear-wishlist", authenticateUser, clearWishlist);

router.post("/addresses",authenticateUser, createAddress);
router.get("/addresses",authenticateUser, getUserAddresses);
router.get("/addresses/:addressId",authenticateUser, getAddressById);
router.put("/addresses/:addressId",authenticateUser, updateAddress);
router.delete("/addresses/:addressId",authenticateUser, deleteAddress);


router.post("/order", authenticateUser, createOrder);
router.get("/order/:orderId", getOrderDetails);
router.get("/order", authenticateUser, getUserOrders);
router.patch("/order/:orderId/status", updateOrderStatus);
router.patch("/order/:orderId/shipping", updateShippingStatus);


router.get("/profile", authenticateUser, getProfile);
router.put("/profile", authenticateUser, updateProfile);
router.delete("/profile", authenticateUser, deleteProfile);



export default router;
