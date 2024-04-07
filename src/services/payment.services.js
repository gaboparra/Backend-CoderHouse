import Stripe from "stripe";
import logger from "../utils/logger.js";

const key = "sk_test_51OxC2OKlCW7s1OuWQFjh7OSZZkFUWdIGUbNNOL1LX2W1jx6od3eqTjaQqiii9megeSsqLu6BBBYcf7cSNvokLHmV00sKRDCg75";

export default class PaymentService {
  constructor() {
    this.stripe = new Stripe(key);
  }

  createPaymentIntent = async (data) => {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create(data);
      return paymentIntent;
    } catch (error) {
      logger.error("Error creating payment intent", error);
    }
  };
}
