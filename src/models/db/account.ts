import type { AccountData } from "../account";

export interface DbAccountData extends AccountData {
    auth_hash: string;
}
