// Module imports
import bcrypt from "bcrypt";

// Util imports
import { query } from "../../../utils/database";

// Type imports
import type { NextApiRequest as Req, NextApiResponse as Res } from "next";
import type { DbAccountData } from "models/db/account";


export default async function register(req: Req, res: Res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        res.status(405).end();
        return;
        // TODO?: Separate this block to a separate util module/file
    }

    const { username, password, passwordRepeat, recaptchaToken } = req.body;
    // console.log(typeof req.body);
    // console.log(password);
    // console.log(req.body.password);

    // Validate password matching
    if (password !== passwordRepeat) {
        res.status(200).json({ code: "password-mismatch", message: "Passwords don't match!" });
        return;
    }

    // Check if username already exists
    const existingUsernames = await query<DbAccountData>("SELECT * FROM account WHERE username=?", username);
    if (existingUsernames.length !== 0) {
        res.status(400).json({ code: "username-already-taken" });
        return;
    }

    try {
        const authHash = await new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    reject(err);
                }

                console.log(password);
                console.log(salt);

                bcrypt.hash(password, salt, (err, finalHash) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(finalHash);
                });
            });
        });

        
        await query(
            "INSERT INTO account (username, auth_hash) VALUES (?, ?)",
            [username, authHash]
        );

        res.status(200).json({ code: "Success!" });
    }
    catch (err) {
        res.status(500).json(err);
        throw err;
    }
}