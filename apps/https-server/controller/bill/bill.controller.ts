import type { Request, Response } from "express";
import stripe from "stripe";
import { prismaClient, SubscriptionStatus } from "db";
import { Tier_Subscription } from "db";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
const stripeClient = new stripe(stripeSecretKey);



export const createCustomer_subscription = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.userId;
        const { tier } = req.body as { tier: Tier_Subscription };

        const consumer = await prismaClient.userBaseAdmin.findUnique({
            where: {
                id: userId,
            },
        });
        if (!consumer) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const { email, name } = consumer;
        let stripeName = "";
        if (!name) {
            stripeName = email.split("@")[0]!;
        }

        const customer = await stripeClient.customers.create({
            name: stripeName,
            email: email,
        });

        const subscription = await stripeClient.subscriptions.create({
            customer: customer.id,
            items: [
                {
                    price: "0.0001",
                },
            ],
        });
        if (!subscription && !customer && !userId) {
            res.status(500).json({ error: "Internal server error" });
            return;
        }

        await prismaClient.subscription.create({
            data: {
                userBaseAdminId: userId!,
                stripeCustomerId: customer.id,
                stripeSubscriptionId: subscription.id,
                tier: Tier_Subscription[tier],
                status: SubscriptionStatus.ACTIVE,
            },
        });

        res.status(200).json({ customer, subscription });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }

};

export const reportWeekalyUsagetoStripe = async () => {
    try {
        const allCustemrs = await prismaClient.subscription.findMany({
            where: {
                status: SubscriptionStatus.ACTIVE,
            },
            select: {
                id: true,
                userBaseAdminId: true,
                stripeCustomerId: true,
                stripeSubscriptionId: true,
                tier: true,
            }
        });

        


   
    }
    
   catch (error) {
    console.log(error);

}

}
