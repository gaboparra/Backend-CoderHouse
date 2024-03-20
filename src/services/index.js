import { User, Product, Cart } from "../dao/factory.js";
import UserRepository from "./user.repository.js";
import ProductRepository from "./product.repository.js";
import CartRepository from "./cart.repository.js";

export const UserService = new UserRepository(new User());
export const ProductService = new ProductRepository(new Product());
export const CartService = new CartRepository(new Cart());
