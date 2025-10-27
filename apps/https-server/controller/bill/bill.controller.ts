import type { Request, Response } from "express";
import stripe from "stripe";
import { prismaClient, SubscriptionStatus } from "@cloud/db";
import { Tier_Subscription } from "@cloud/db";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
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
        })


        if (!consumer) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const { email, first_name } = consumer;
        let stripeName = "";
        if (!first_name) {
            stripeName = email.split("@")[0]!;
        }

        const customer = await stripeClient.customers.create({
            name: stripeName,
            email: email,
        });

        const session = await stripeClient.checkout.sessions.create({
            mode: 'subscription',
            customer: customer.id,
            line_items: [{ price: 'price_ABC123', quantity: 0 }],
            success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/usage/subscription/success?session_id={CHECKOUT_SESSION_ID}`, 
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/usage/subscription/cancel`,
            metadata: {
                userId: userId!,
                tier: tier,
            },
        });
        if (!session && !customer && !userId) {
            res.status(500).json({ message: "Internal server error", success: false });
            return;
        }

        const new_subscription = await prismaClient.subscription.upsert({
            where: {
                userBaseAdminId: userId!,
            },
            create: {
                userBaseAdminId: userId!,
                stripeCustomerId: customer.id!,
                stripeSubscriptionId: null,
                status: SubscriptionStatus.ACTIVE,

            },
            update: {
                userBaseAdminId: userId!,
                stripeCustomerId: customer.id!,
                stripeSubscriptionId: null,
                status: SubscriptionStatus.ACTIVE,

            },
        })


        return res.status(200).json({
            success: true,
            message: "Checkout session created",
            checkoutUrl: session.url,
        });
    } catch (error) {
      
        res.status(500).json({ message: "Internal server error", success: false });
    }

};



export const stripeWebhookHandler = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripeClient.webhooks.constructEvent(req.body, sig!, stripeWebhookSecret);
    } catch (err) {
        return res.status(400).json({ message: "Webhook Error: verification failed ", success: false });
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const subscriptionId = session.subscription as string;
            const customerId = session.customer as string;
            const tier = session.metadata?.tier as Tier_Subscription;
            await saveSubscriptionToDB(customerId, subscriptionId, tier);
            break;
        case 'customer.subscription.deleted':

            break;
        default:
            return res.status(400).json({ message: "Webhook Error: unknown event type ", success: false });
    }

    res.status(200).json({ message: "Webhook received successfully", success: true });

};

export async function saveSubscriptionToDB(
    customerId: string,
    subscriptionId: string,
    tier: Tier_Subscription
) {
    try{

    
    const user = await prismaClient.userBaseAdmin.findFirst({
        where: { subscription: { stripeCustomerId: customerId } },
        include: { subscription: true },
    });

    if (!user) {
        console.log("No user found for Stripe customer:", customerId);
        return;
    }

    const tierRule = getTierRule(tier);

    let tierId = user.subscription?.tierId;
    if (!tierId) {
        const newTierRule = await prismaClient.tierRule.create({
            data: { ...tierRule, tier },
        });
        tierId = newTierRule.id;
    }

    await prismaClient.subscription.upsert({
        where: { id: user.subscription?.id },
        create: {
            userBaseAdminId: user.id,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            status: SubscriptionStatus.ACTIVE,
            tierId: tierId,
        },
        update: {
            tierId: tierId,
            stripeSubscriptionId: subscriptionId,
            status: SubscriptionStatus.ACTIVE,
        },
    });
}catch(error){
  console.log(error);

}
}
function getTierRule(tier: Tier_Subscription) {
    switch (tier) {
        case Tier_Subscription.FREE:
            return {
                Max_Projects: 2,
                Max_Resources: 5,
                initialMemory: "200Mi",
                maxMemory: "500Mi",
                initialStorage: "1Gi",
                maxStorage: "5Gi",
                initialVCpu: "1",
                maxVCpu: "2",
            };
        case Tier_Subscription.BASE:
            return {
                Max_Projects: 10,
                Max_Resources: 500,
                initialMemory: "200Mi",
                maxMemory: "32Gi",
                initialStorage: "1Gi",
                maxStorage: "1Ti",
                initialVCpu: "1",
                maxVCpu: "32",
            };
        case Tier_Subscription.PRO:
            return {
                Max_Projects: 50,
                Max_Resources: 500,
                initialMemory: "200Mi",
                maxMemory: "64Gi",
                initialStorage: "1Gi",
                maxStorage: "1Ti",
                initialVCpu: "1",
                maxVCpu: "64",
            };
        case Tier_Subscription.ENTERPRISE:
            return {
                Max_Projects: 100,
                Max_Resources: 1000,
                initialMemory: "200Mi",
                maxMemory: "128Gi",
                initialStorage: "1Gi",
                maxStorage: "1Ti",
                initialVCpu: "1",
                maxVCpu: "128",
            };
        default:
            return {
                Max_Projects: 0,
                Max_Resources: 0,
                initialMemory: "0",
                maxMemory: "0",
                initialStorage: "0",
                maxStorage: "0",
                initialVCpu: "0",
                maxVCpu: "0",
            };
    }
}
