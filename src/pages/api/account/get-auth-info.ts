// Util imports
import { validateSessionCookie } from "utils/validate-session";

// Type imports
import type { NextApiRequest, NextApiResponse } from "next"
import type { AuthInfo } from "models/auth";

export default async function getAuthInfo(req: NextApiRequest, res: NextApiResponse<AuthInfo>) {
    const authInfo = await validateSessionCookie(req.cookies.Authorization);
    if (!authInfo.isAuthenticated) {
    }

    res.status(200).json(authInfo);
}
