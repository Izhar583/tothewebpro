export const ADMIN_COOKIE_NAME = "tothewebpro_admin_session";

const DEFAULT_SECRET = "tothewebpro-admin-secret-key-2026-super-secure-token-99";

function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET || DEFAULT_SECRET;
  return new TextEncoder().encode(secret);
}

// Convert ArrayBuffer or Uint8Array to base64url string
function bufferToBase64Url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Convert base64url string to Uint8Array
function base64UrlToBuffer(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export interface AdminTokenPayload {
  username: string;
  role: "admin";
  exp: number; // timestamp in seconds
}

/**
 * Creates a signed HMAC-SHA256 session token
 */
export async function createAdminToken(username: string): Promise<string> {
  const payload: AdminTokenPayload = {
    username,
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  };

  const header = { alg: "HS256", typ: "JWT" };

  const encodedHeader = bufferToBase64Url(
    new TextEncoder().encode(JSON.stringify(header))
  );
  const encodedPayload = bufferToBase64Url(
    new TextEncoder().encode(JSON.stringify(payload))
  );

  const message = `${encodedHeader}.${encodedPayload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    getSecretKey() as unknown as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message) as unknown as BufferSource
  );

  const encodedSignature = bufferToBase64Url(signature);
  return `${message}.${encodedSignature}`;
}

/**
 * Verifies a signed session token
 */
export async function verifyAdminToken(
  token: string | undefined | null
): Promise<AdminTokenPayload | null> {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const message = `${encodedHeader}.${encodedPayload}`;

    const key = await crypto.subtle.importKey(
      "raw",
      getSecretKey() as unknown as BufferSource,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signatureBytes = base64UrlToBuffer(encodedSignature);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      new TextEncoder().encode(message) as unknown as BufferSource
    );

    if (!isValid) return null;

    const payloadJson = new TextDecoder().decode(
      base64UrlToBuffer(encodedPayload)
    );
    const payload = JSON.parse(payloadJson) as AdminTokenPayload;

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Validates admin credentials against environment variables
 */
export function validateAdminCredentials(
  usernameInput: string,
  passwordInput: string
): boolean {
  const expectedUsername = process.env.ADMIN_USERNAME || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD || "Admin@ToTheWeb2026!";

  return (
    usernameInput.trim() === expectedUsername.trim() &&
    passwordInput === expectedPassword
  );
}
