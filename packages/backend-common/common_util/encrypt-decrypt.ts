

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const keySalt=process.env.KEY_SALT || "BHggjvTfPlIYmIOjbYut";
async function getKey(secret: string): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(keySalt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}


export async function encrypt(text: string, secret: string): Promise<string> {
  const key = await getKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(text)
  );
  const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.byteLength);
  return Buffer.from(combined).toString('base64');
}


export async function decrypt(encryptedBase64: string, secret: string): Promise<string> {
  const key = await getKey(secret);
  const combined = new Uint8Array(Buffer.from(encryptedBase64, 'base64'));
  const iv = combined.slice(0, 12); 
  const data = combined.slice(12); 

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  return decoder.decode(decrypted);
}


const adjectives = [
  "Swift", "Bright", "Cool", "Silent", "Funky", "Brave", "Quick", "Happy"
];
const nouns = [
  "Tiger", "Fox", "Eagle", "Lion", "Wolf", "Bear", "Shark", "Hawk"
];

export function generateUsername(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  const num = Math.floor(Math.random() * 1000); 

  let username = adj!+ noun! + num!;
  
  if (username.length > 12) {
    username = username.slice(0, 12);
  }

  return username;
}
