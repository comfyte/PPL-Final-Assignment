// Util imports
import { generateHS256 } from "./helpers/generate-hs256";
import { parseBase64Url } from "./helpers/base64-url";
import { query } from "./database";

// Type imports
import type { JwtHeader, JwtPayload } from "../models/json-web-token";
import type { DbAccountData } from "models/db/account";
import type { AuthInfo } from "../models/auth";

export async function validateSessionCookie(jwtCookie: string | undefined): Promise<AuthInfo> {

    const unauthorized: AuthInfo = { isAuthenticated: false }; ///unauthenticated?

    if (!jwtCookie) {
        return unauthorized;
    }

    const jwt = jwtCookie.match(/^Bearer (.*)$/)?.[1];

    if (!jwt) {
        return unauthorized;
    }

    const [encodedHeader, encodedPayload, signature] = jwt.split('.');

    const header : JwtHeader  = JSON.parse(parseBase64Url(encodedHeader));
    const payload: JwtPayload = JSON.parse(parseBase64Url(encodedPayload));

    if (header.alg !== "HS256" || header.typ !== "JWT") {
        return unauthorized;
    }
    
    const accountQueryResult = await query<DbAccountData>(
        "SELECT id, username, auth_hash, role FROM account WHERE id=?",
        payload.id
    );

    // Check if the account even exists
    if (accountQueryResult.length !== 1) {
        return unauthorized;
    }

    const { id, username, auth_hash, role } = accountQueryResult[0];

    // Verify the signature AFTER obtaining the authHash used as the secret/salt
    const secretKey = process.env.JWT_ADDITIONAL_SECRET + auth_hash;
    const stringToCompare = generateHS256(`${encodedHeader}.${encodedPayload}`, secretKey);
    if (signature !== stringToCompare) {
        // return { isValid: false };
        return { isAuthenticated: false };
    }

    return {
        isAuthenticated: true,
        accountData: { id, username, role }
    };
}