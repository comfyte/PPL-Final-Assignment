// Style imports
import "nprogress/nprogress.css";
import "../main.css";

// Framework imports
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

// Module imports
import NProgress from "nprogress";

// Component imports
import { PageHeader } from "components/header";
import { Footer as PageFooter } from "components/footer";

// Util imports
import { ClientAuthProvider } from "utils/client-auth-context";

// Type imports
import type { AppProps } from "next/app";
import type { AuthInfo } from "src/models/auth";
import { fetchAuthInfo } from "src/utils/client-side-fetch-auth-info";


// Set up NProgress styles/configurations
NProgress.configure({
    showSpinner: false,
    parent: "#pageHeader",
});

function useProgressBar() {
    const router = useRouter();

    const nProgressTimer = useRef<NodeJS.Timeout>();

    useEffect(() => {
        function showProgressBar() {
            if (nProgressTimer.current) {
                clearTimeout(nProgressTimer.current);
            }

            nProgressTimer.current = setTimeout(() => {
                NProgress.start();
            }, 500);
        }

        function hideProgressBar() {
            NProgress.done();

            if (nProgressTimer.current) {
                clearTimeout(nProgressTimer.current);
                nProgressTimer.current = undefined;
            }
        }

        const eventBindings = Object.entries({
            "routeChangeStart": showProgressBar,
            "routeChangeComplete": hideProgressBar,
            "routeChangeError": hideProgressBar
        });

        for (const [event, handler] of eventBindings) {
            // @ts-ignore
            router.events.on(event, handler);
        }

        return () => {
            for (const [event, handler] of eventBindings) {
                // @ts-ignore
                router.events.off(event, handler);
            }
        }
    }, []);
}

export default function CustomAppShell({ Component: PageComponent, pageProps }: AppProps) {
    const [clientAuthState, setClientAuthState] = useState<AuthInfo>();

    async function fetchAuthInfoIfNotExists() {
        await new Promise((resolve) => {
            setTimeout(resolve, 50);
        });
        let latestAuthInfoValue;
        setClientAuthState(value => {
            latestAuthInfoValue = value;
            console.log("Client auth info value is", value);
            return value;
        });

        if (latestAuthInfoValue) {
            return;
        }

        console.log("this is getting run!");

        const responseData = await fetchAuthInfo();
        setClientAuthState(responseData); // or use the syncGlobalAuthInfoState() one?
    }

    useEffect(() => {
        fetchAuthInfoIfNotExists();
    }, []);

    useProgressBar();

    return (
        <ClientAuthProvider value={{ clientAuthState, setClientAuthState }}>
            <PageHeader />            

            <main id="pageContent">
                <PageComponent {...pageProps} />
            </main>

            <PageFooter />
        </ClientAuthProvider>
    );
}
