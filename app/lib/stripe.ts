import Stripe from "stripe";
const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
    throw new Error("Stripe key not found");
}
export const stripe = new Stripe(
    stripeKey,
);