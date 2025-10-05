import crypto from "node:crypto";


export function encrypt(text: string, secret: string,keySalt:string): string {
  const key = crypto.pbkdf2Sync(secret, keySalt, 100000, 32, "sha256");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decrypt(encryptedBase64: string, secret: string,keySalt:string): string {
  const data = Buffer.from(encryptedBase64, "base64");
  const iv = data.subarray(0, 12);
  const tag = data.subarray(12, 28);
  const encrypted = data.subarray(28);

  const key = crypto.pbkdf2Sync(secret, keySalt, 100000, 32, "sha256");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}


export function generateUsername(): string {
    const adjectives = [
        "Swift", "Bright", "Cool", "Silent", "Funky", "Brave", "Quick", "Happy"
    ];
    const nouns = [
        "Tiger", "Fox", "Eagle", "Lion", "Wolf", "Bear", "Shark", "Hawk"
    ];
    
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    const num = Math.floor(Math.random() * 1000); 

    let username = adj!+ noun! + num!+crypto.randomUUID()
    
    if (username.length > 12) {
        username = username.slice(0, 12);
    }

    return username;
}
    
