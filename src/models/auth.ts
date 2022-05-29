import type { AccountData } from "./account";

interface Unauthorized {
    isAuthenticated: false;
}

interface Authorized {
    isAuthenticated: true;
    accountData: AccountData;
}

export type AuthInfo = Authorized | Unauthorized;

export type SyncClientAuthInfoState = (authInfo: AuthInfo) => void;