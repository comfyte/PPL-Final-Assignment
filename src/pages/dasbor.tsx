// Util imports
import { withServerSideAuthCheck } from "utils/wrappers/server-side-auth-check";

// Type imports
// import { AccountData } from "../../types/account";
import { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useSyncAuthState } from "utils/client-auth-context";


type ActionCardProps = {
    href: string;
    title: string;
    description: string | JSX.Element;
    // svgIcon?
}
function ActionCard({ href, title, description }: ActionCardProps) {
    return (
        <Link href={href}>
            <a className="block rounded-lg shadow bg-white p-8 w-60 m-4">
                {/* <div className=""> */}
                    <div className="flex flex-row">
                        <span className="block text-md font-bold transition-colors">{title}</span>
                    </div>
                    <p className="text-sm mt-2">{description}</p>
                {/* </div> */}

                <style jsx>{`
                    span::after {
                        content: "${' \\2192'}";

                        display: inline-block;
                        margin-left: 0.2rem; /* HACK */

                        transition: transform 150ms;
                    }

                    a:hover span {
                        text-decoration: underline;
                        color: #2563EB; /* FIXME, probably avoid hardcoding it */
                    }
                    a:hover span::after {
                        transform: translateX(25%);
                    }
                `}</style>
            </a>
        </Link>
    )
}

// type DashboardPageProps = {
//     // accountData: AccountData;
//     serverAuthState: serverAuthState
// }
// type DashboardPageProps = ;

export default function DashboardPage({ serverAuthState }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    useSyncAuthState(serverAuthState);
    // useEffect(() => {
    //     syncClientAuthState(serverAuthState);
    // }, []);
    
    // console.log("yo am still getting executed!");
    // console.log(testo);
    function greetingText() {
        // const currentDateTime = new Date();
        // switch (currentDateTime.getHours()) {}
        const currentHour = new Date().getHours();

        if (currentHour >= 3 && currentHour < 11) {
            return "Pagi";
        }
        else if (currentHour >= 11 && currentHour < 15) {
            return "Siang";
        }
        else if (currentHour >= 15 && currentHour < 19) {
            return "Sore";
        }
        else {
            return "Malam";
        }
    }

    // HACK
    // Alternative: Early return (with null/undefined) if isAuthenticated is indicated as false
    return serverAuthState.isAuthenticated && (
        <div className="bg-gray-200 flex-grow flex flex-col items-center justify-center">
            <div>
                <h1 className="text-4xl font-bold tracking-tight m-4">{greetingText()}, {serverAuthState.accountData.username}!</h1>
                <p className="text-2xl font-light tracking-tight m-4">
                    Kami siap membantu kamu. {/* Apa yang ingin/mau kamu lakukan? */}
                </p>

                <div className="flex">
                    <ActionCard
                        href="#lipsum"
                        title="Lorem one"
                        description="Lorem ipsum dolor sit amet,"
                    />
                    <ActionCard
                        href="#lipsum"
                        title="Lorem two"
                        description="Lorem ipsum dolor sith amet."
                    />
                    <ActionCard
                        href="#lipsum"
                        title="Lorem three"
                        description={<>Lorem <b>tiga</b>.</>}
                        // / Perlu bantuan? (call icon on the left?)
                    />
                </div>
            </div>

            <style jsx>{`
                :global(#page-content) {
                    display: flex;
                    flex-direction: column;
                }
            `}</style>
        </div>
    );
}

// DashboardPage.getServ
export const getServerSideProps = withServerSideAuthCheck()/*<{ serverAuthState: serverAuthState }>(
    async function (serverAuthState) {
        
        return {
            props: { serverAuthState }
        }
        // console.log("gssp is getting runned!");
        // return {
        //     props: {
        //         testo: "abcscaksd"
        //     },
        //     redirect: {
        //         destination: "/akun/masuk",
        //         permanent: false
        //     }
        // }
        // context.
    }
);*/