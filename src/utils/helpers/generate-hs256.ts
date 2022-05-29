import crypto from "crypto";

export function generateHS256(string: string, secret: string): string {
    return crypto.createHmac("sha256", secret).update(string).digest("base64");
}