import { Router } from "express";
import ProductModel from "../dao/mongo/models/products.model.js";
import PaymentService from "../services/payment.services.js";
import logger from "../utils/logger.js";

const PaymentRouter = Router();

PaymentRouter.post("/payment-intents", async (req, res) => {
  try {
    const { productIds } = req.body;

    const products = await ProductModel.find({ _id: { $in: productIds } });
    if (!products || products.length === 0) {
      return res.status(404).json({ status: "error", message: "Products not found" });
    }

    const totalAmount = products.reduce(
      (acc, product) => acc + product.price, 0);

    const paymentIntentInfo = {
      amount: totalAmount,
      currency: "usd",
      payment_method_types: ["card"],
    };

    const service = new PaymentService();
    const result = await service.createPaymentIntent(paymentIntentInfo);

    console.log(result);
    return res.json({ status: "success", payload: result });
  } catch (error) {
    logger.error("Error creating payment intent:", error);
    return res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

export default PaymentRouter;
