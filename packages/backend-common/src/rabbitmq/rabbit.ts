import amqp from "amqplib";
import type { Channel, ChannelModel } from "amqplib";
import type { InfraConfigSchema,  } from "../common-zod-schema/infraConfig";
import type { vmSchema } from "../common-zod-schema/vmSchema";
import type z from "zod";

type InfraConfig = z.infer<typeof InfraConfigSchema>;
type vmSchema = z.infer<typeof vmSchema>;
let connection: ChannelModel | null = null;
let channel: Channel | null = null;

async function getRabbitMQChannel() {
    if (channel && connection) {
        return { channel, connection };
    }

    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost:5672", { rejectUnauthorized: false });
        
       
        connection.on("error", (err) => {
            console.error("RabbitMQ connection error:", err);
            channel = null;
            connection = null;
        });

        connection.on("close", () => {
            console.log("RabbitMQ connection closed");
            channel = null;
            connection = null;
        });

        channel = await connection.createChannel();
        return { channel, connection };
    } catch (e) {
        console.error("Error connecting to RabbitMQ:", e);
        channel = null;
        connection = null;
        throw e;
    }
}

export async function pushInfraConfigToQueueToCreate(queue_name: string, item: InfraConfig) {
    try {
        const { channel } = await getRabbitMQChannel();
        await channel.assertQueue(queue_name, { durable: true });
        const success = channel.sendToQueue(
            queue_name, 
            Buffer.from(JSON.stringify(item)), 
            { persistent: true }
        );
        return success;
    } catch (e) {
        console.error("Error in pushToQueue:", e);
        return false;
    }
}

export async function pushInfraConfigToQueueToDelete(queue_name: string, item:string) {
    try {
        const { channel } = await getRabbitMQChannel();
        await channel.assertQueue(queue_name, { durable: true });
        const success = channel.sendToQueue(
            queue_name, 
            Buffer.from(JSON.stringify(item)), 
            { persistent: true }
        );
        return success;
    } catch (e) {
        console.error("Error in pushToQueue:", e);
        return false;
    }
}

export async function consumeInfraConfigFromQueueToCreate(queue_name: string, provisioner: (infraConfig: InfraConfig) => Promise<{message:string,success:boolean}>) {
    try {
        const { channel } = await getRabbitMQChannel();
        await channel.assertQueue(queue_name, { durable: true });
        channel.prefetch(100);
        
        channel.consume(queue_name, async (msg) => {
            if (!msg) return;
            
            const task:InfraConfig = JSON.parse(msg.content.toString());
            try {
                const {success} = await provisioner(task);
                if (success) {
                    channel.ack(msg);
                    console.log("Processed and acked:", task);
                } else {
                    channel.nack(msg, false, false);
                    console.log("Processing failed:", task);
                }
            } catch (e) {
                channel.nack(msg, false, false);
                console.error("Error processing message:", e);
            }
        }, { noAck: false });
    } catch (e) {
        console.error("Error in consumeFromQueue:", e);
    }
}
export async function consumeInfraConfigFromQueueToDelete(queue_name: string, destroyer: (infraConfig: string) => Promise<boolean>) {
    try {
        const { channel } = await getRabbitMQChannel();
        await channel.assertQueue(queue_name, { durable: true });
        channel.prefetch(100);
        
        channel.consume(queue_name, async (msg) => {
            if (!msg) return;
            
            const task:string = JSON.parse(msg.content.toString());
            try {
                const success = await destroyer(task);
                if (success) {
                    channel.ack(msg);
                    console.log("Processed and acked:", task);
                } else {
                    channel.nack(msg, false, false);
                    console.log("Processing failed:", task);
                }
            } catch (e) {
                channel.nack(msg, false, false);
                console.error("Error processing message:", e);
            }
        }, { noAck: false });
    } catch (e) {
        console.error("Error in consumeFromQueue:", e);
    }
}
export interface vmSchemaDetails extends vmSchema{
    vmId:string
    subscriptionPlan:string
}

export async function pushVmToQueueToCreate(queue_name: string, item: vmSchemaDetails) {
    try {
        const { channel } = await getRabbitMQChannel();
        await channel.assertQueue(queue_name, { durable: true });
        const success = channel.sendToQueue(
            queue_name, 
            Buffer.from(JSON.stringify(item)), 
            { persistent: true }
        );
        return success;
    } catch (e) {
        console.error("Error in pushToQueue:", e);
        return false;
    }
}

export async function pushVmToQueueToDelete(queue_name: string, item:string) {
    try {
        const { channel } = await getRabbitMQChannel();
        await channel.assertQueue(queue_name, { durable: true });
        const success = channel.sendToQueue(
            queue_name, 
            Buffer.from(JSON.stringify(item)), 
            { persistent: true }
        );
        return success;
    } catch (e) {
        console.error("Error in pushToQueue:", e);
        return false;
    }
}

export async function consumeVmFromQueueToCreate(queue_name: string, provisioner: (vm: vmSchemaDetails) => Promise<{message:string,success:boolean,host:string}>) {
    try {
        const { channel } = await getRabbitMQChannel();
        await channel.assertQueue(queue_name, { durable: true });
        channel.prefetch(100);
        
        channel.consume(queue_name, async (msg) => {
            if (!msg) return;
            
            const task:vmSchemaDetails = JSON.parse(msg.content.toString());
            try {
                const {success} = await provisioner(task);
                if (success) {
                    channel.ack(msg);
                    console.log("Processed and acked:", task);
                } else {
                    channel.nack(msg, false, false);
                    console.log("Processing failed:", task);
                }
            } catch (e) {
                channel.nack(msg, false, false);
                console.error("Error processing message:", e);
            }
        }, { noAck: false });
    } catch (e) {
        console.error("Error in consumeFromQueue:", e);
    }
}

export async function consumeVmFromQueueToDelete(queue_name: string, destroyer: (vm: string) => Promise<boolean>) {
    try {
        const { channel } = await getRabbitMQChannel();
        await channel.assertQueue(queue_name, { durable: true });
        channel.prefetch(100);
        
        channel.consume(queue_name, async (msg) => {
            if (!msg) return;
            
            const task:string = JSON.parse(msg.content.toString());
            try {
                const success = await destroyer(task);
                if (success) {
                    channel.ack(msg);
                    console.log("Processed and acked:", task);
                } else {
                    channel.nack(msg, false, false);
                    console.log("Processing failed:", task);
                }
            } catch (e) {
                channel.nack(msg, false, false);
                console.error("Error processing message:", e);
            }
        }, { noAck: false });
    } catch (e) {
        console.error("Error in consumeFromQueue:", e);
    }
}   



process.on('SIGINT', async () => {
    if (channel) {
        await channel.close();
        channel = null;
    }
    if (connection) {
        await connection.close();
        connection = null;
    }
    process.exit(0);
});