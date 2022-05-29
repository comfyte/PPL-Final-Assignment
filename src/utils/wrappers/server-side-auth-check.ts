// Util imports
import { validateSessionCookie } from "../validate-session";

// Type imports
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
// import { AccountData } from "../types/account";
import type { AuthInfo } from "models/auth";
import { ParsedUrlQuery } from "node:querystring";
// import { ParsedUrlQuery } from "node:querystring";

// import { GetServerSidePropsContext } from "next";

// type WithAccountData = (accountData: any) => any

// TODO: Consider / add support for the generics?

// type WrappedGsspFunction<T> = (
//     accountData: AccountData,
//     ...params: Parameters<GetServerSideProps<T>>
// ) => ReturnType<GetServerSideProps<T>>;

// type PropsObj = P extends { [key: string] } = {[key: string]: any};
type PropsObj = {
    // henlo: null;
    // serverAuthState: AuthInfo/*/*Authorized*/;
    [key: string]: any;
}

// type GsspParameters<P> = Parameters<GetServerSideProps<P>>;

// type GsspAsyncFunction<P extends PropsObj = PropsObj> = (
//     retrievedAuthInfoFromServer: /*AuthInfo*/Authorized,
//     context: Parameters<GetServerSideProps<P>>[0]
//     // accountData: AccountData
// ) => ReturnType<GetServerSideProps<P>>;

// type CallbackFunction<P> = 
//     (context: GsspParameters<P>[0] & { authInfo: AuthInfo }) => ReturnType<GetServerSideProps<P>>;

type InitialFunc<P, Q extends ParsedUrlQuery = ParsedUrlQuery> = 
    (context: GetServerSidePropsContext<Q> & { serverAuthState: AuthInfo/*Authorized*/ }) =>
    Promise<GetServerSidePropsResult<P> | null>;

export function withServerSideAuthCheck<P extends PropsObj>(fn?: InitialFunc<P>): GetServerSideProps<{ serverAuthState: AuthInfo } & P> {
    return async function getServerSideProps(context) {    
        // const authToken = readAuthTokenFromCookies(context.req.headers.cookie);
    
        // const authInfo: AuthInfo = authToken ? await validateSession(authToken) : { isAuthenticated: false };
        const authInfo = await validateSessionCookie(context.req.cookies.Authorization);

        const wrapperOptions = authInfo.isAuthenticated ? {} : {
            redirect: {
                destination: "/masuk",
                permanent: false
            }
        };

        // const originalReturns = await fn(context); //additions

        // const initialOptions = await fn({ ...context, authInfo })/* as { props: any, redirect?: any, notFound?: any }*/;
        // // if (callbackReturns.props) {}
        // // callbackReturns.redirect
        // // callbackReturns.redirect
        // // callbackReturns.props
        // // return callbackReturns;

        // const { props, ...rest } = initialOptions;

        const {
            props: initialProps,
            ...initialOptions
        } = await fn?.({ ...context, serverAuthState: authInfo }) as /* HACK *//*Extract<GetServerSidePropsResult<P>, { props: P }>*/any || {};
// console.log(initialOptions);
        return {
            ...wrapperOptions,
            ...initialOptions,
            props: { serverAuthState: authInfo, ...initialProps }
        };

        // const props = ("props" in callbackReturns) ? callbackReturns.props : {};

        // if ("props" in callbackReturns) {
        //     return {
        //         ...(callbackReturns.props)
        //     }
        // }
        // if (callbackReturns.props) {
        //     return {
        //         ...(callbackReturns.props)
        //     }
        // }

        // return {
        //     // ...wrapperReturns,
        //     // ...originalReturns
        //     ...wrapperReturns,
        //     props: {
        //         authInfo,
        //         ...("props" in callbackReturns && callbackReturns.props)
        //     },
        //      ..originalReturns
        // };

        // 
        // return {
        //     props: {
        //         authInfo: "a"
        //     }
        // };

        // if ("props" in callbackReturns) {
        //     if ("redirect" in wrapperReturns) {
        //         return wrapperReturns;
        //     }
        //     else {
        //         return callbackReturns;
        //     }
        // }
        // // if ("redirect" in callbackReturns) {
        // //     return callbackReturns;
        // // }
        // return callbackReturns;
    }
    // return gssp;
}

// export const serverSideAuthCheck: GetServerSideProps = async (data, context) => {
//     return {
//         redirect: {
//             destination: "/"
//         }
//     }
// }

// export async function serverSideAuthCheck({ req }: GetServerSidePropsContext) {}

export type InferGsspType<T> = T extends GetServerSideProps<infer P, any> ? P : never;