import { NextApiRequest as Req, NextApiResponse as Res } from "next";

export default function logOut(req: Req, res: Res) {
    // TODO: This is too simple, maybe?
    res.setHeader("Set-Cookie", ["Authorization=null; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"]);
    // res.status(200).end();
    res.redirect(302, "/");
}