// no-auth

import { withServerSideAuthCheck } from "./server-side-auth-check";

type WithServerSideAuthCheck = typeof withServerSideAuthCheck;

// Can we make this a `const` instead of an immediately-returning function like this?
export function withPublicOnlyPage(/*fn?: Parameters<WithServerSideAuthCheck>[0]*/): ReturnType<WithServerSideAuthCheck> {
    return withServerSideAuthCheck(async (context) => {
        if (context.serverAuthState.isAuthenticated) {
            return {
                redirect: {
                    destination: "/dasbor",
                    permanent: false
                }
            }
        }
        // console.log("hey")

        // return fn?.(context) || null;
        return {
            redirect: undefined,
            props: {} // Dummy props to avoid the ts compiler whining about it
        }
    });
}