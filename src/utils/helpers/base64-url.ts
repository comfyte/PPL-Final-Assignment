function _b64UrlEncode(string: string) {
    return string.replace(/\+/g, "-").replace(/\//g, "_");
}

function _b64UrlDecode(string: string) {
    return string.replace(/-/g, '+').replace(/_/g, '/');
}

export function encodeBase64Url(string: string) {
    return _b64UrlEncode(Buffer.from(string).toString("base64"));
}

export function parseBase64Url(base64string: string) {
    const urlDecoded = base64string;
    return _b64UrlDecode(Buffer.from(urlDecoded, "base64").toString("utf-8"));
}