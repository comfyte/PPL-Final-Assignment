export interface JwtHeader {
    alg: "HS256";
    typ: "JWT";
}
// Or export the object value directly?

export interface JwtPayload {
    id: number;
    ip: string;
    exp: string;
}