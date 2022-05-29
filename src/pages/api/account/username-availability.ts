// Util imports
import { query } from "../../../utils/database";

// Type imports
import type { NextApiRequest as Req, NextApiResponse as Res } from "next";
import type { DbAccountData } from "models/db/account";


export default async function CheckUsernameAvailability(req: Req, res: Res) {
    const { username } = req.body;

    try {
        const queryResult = await query<DbAccountData>("SELECT id FROM account WHERE username=?", username);

        // let responseObject;
        // if 

        res.status(200).json({
            username,
            isAvailable: queryResult.length === 0
        });
    } catch (err) {
        res.status(500).end();
        throw err;
    }
}