import { getRedisClient } from "../common";

export async function acquireGitPushLock(ttlInSeconds = 120,lockName:string): Promise<boolean> {
    try {
        const client = await getRedisClient();
        const currentLock = await client.get(lockName);

        if (currentLock === "lock-busy") {
            return false; 
        }

        const result = await client.set(lockName, JSON.stringify("lock-busy"), {
            expiration: { type: 'EX', value: ttlInSeconds },
        });

        return result === 'OK';
    } catch (error) {
        console.error('Error acquiring git push lock in Redis:', error);
        return false;
    }
}
export async function releaseGitPushLock(lockName:string): Promise<boolean> {
    try {
        const client = await getRedisClient();
        const result = await client.del(lockName);

        if (result === 1) {
            return true; 
        } else {
            console.warn('Git push lock already expired or not present');
            return true;
        }
    } catch (error) {
        console.error('Error releasing git push lock in Redis:', error);
        return false;
    }
}
