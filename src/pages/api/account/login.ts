// Module imports
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";

// Util imports
import { query } from "utils/database";
import { encodeBase64Url } from "utils/helpers/base64-url";
import { generateHS256 } from "utils/helpers/generate-hs256";

// Type imports
import type { NextApiRequest as Req, NextApiResponse as Res } from "next";
import type { DbAccountData } from "models/db/account";
import type { JwtHeader, JwtPayload } from "../../../models/json-web-token";

async function verifyPassword(password: string, authHash: string) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, authHash, (err, isSame) => {
            if (err) {
                reject(err);
            }

            resolve(isSame);
        });
    });
}

function generateJwt(userId: number, expirationTime: string, secret: string) {
    const header: JwtHeader = {
        alg: "HS256",
        typ: "JWT"
    };
    const payload: JwtPayload = {
        id: userId,
        ip: "0.0.0.0",
        exp: expirationTime
    };

    const headerString  = JSON.stringify(header);
    const payloadString = JSON.stringify(payload);

    const encodedHeader  = encodeBase64Url(headerString);
    const encodedPayload = encodeBase64Url(payloadString);

    const jwtSequence = [encodedHeader, encodedPayload];
    const jwt = () => jwtSequence.join('.');

    const signature = generateHS256(jwt(), secret);
    jwtSequence.push(signature);

    return jwt();
}

export default async function logIn(req: Req, res: Res) {
    if (req.method !== "POST") {
        return;
    }

    // Validate username here (if username is empty, etc, etc...)

    const { username, password } = req.body;
    if (!username || !password) {
        // res.status(200).json({
        //     successful: false,
        //     code: "incomplete-data-provided",
        //     message: "Either the data is incomplete, or the Accept-Type header is incorrect." }
        // );
        res.status(StatusCodes.BAD_REQUEST).end();
        return;
    }

    // if (!username.match(new RegExp(usernameRegExpString))) {
    //     res.status(200).json({
    //         successful: false,
    //         code: ""
    //     });
    //     return;
    // }

    // if (password.length < 8 || password.length > 200) {
    //     res.status(200).json({
    //         successful: false
    //     })
    // }

    const accountQueryResult = await query<DbAccountData>(
        "SELECT id, username, auth_hash FROM account WHERE username=?",
        username
    );
    console.log(accountQueryResult)
    if (accountQueryResult.length !== 1) {
        // res.status(200).json({
        //     successful: false,
        //     code: "no-account-found"
        // });
        // res.status(StatusCodes.UNAUTHORIZED).end();
        res.status(StatusCodes.NOT_FOUND).end();
        return;
    }
    const accountData = accountQueryResult[0];

    const isPasswordCorrect = await verifyPassword(password, accountData.auth_hash);
    if (!isPasswordCorrect) {
        // res.status(200).json({ message: "Password incorrect/salah!" });
        res.status(StatusCodes.UNAUTHORIZED).end();
        return;
    }

    const currentDate = new Date();
    const tokenExpiration = new Date(currentDate.setMonth(currentDate.getMonth() + 1));

    const jwtSecret = process.env.JWT_ADDITIONAL_SECRET + accountData.auth_hash;
    const authToken = generateJwt(accountData.id, tokenExpiration.toString(), jwtSecret);
    // console.log(authToken);

    res.setHeader("Set-Cookie", `Authorization=Bearer ${authToken}; path=/; httponly`); // TODO: Add expiration time/date to the cookie value

    // const 
    res.status(StatusCodes.OK).json({ id: accountData.id, username });
    // res.end();
}