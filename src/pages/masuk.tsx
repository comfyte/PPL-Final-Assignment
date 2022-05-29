// Framework imports
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/router";

// Component imports
import Input from "components/auth-input";

// Type imports
// import { GlobalPageProps } from "../_app";
// import type { AuthInfo } from "../../models/auth";
// import type { AccountData } from "models/account";
import { useClientAuthContext } from "src/utils/client-auth-context";
import { StatusCodes } from "http-status-codes";
// import { withServerSideAuthCheck } from "src/utils/wrappers/server-side-auth-check";
import { withPublicOnlyPage } from "src/utils/wrappers/server-side-public-only-page";


// type LoginPagePropTypes = {
//     updateAuthInfo: (authInfo: AuthInfo) => void;
// }

function LoginPage() {
    const [isLoggingIn, setLoggingIn] = useState<boolean>(false);

    const username = useRef<HTMLInputElement>();
    const password = useRef<HTMLInputElement>();

    const router = useRouter();

    const { setClientAuthState } = useClientAuthContext();

    async function authenticate(username: string, password: string) {
        setLoggingIn(true);

        const response = await fetch("/api/account/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        setLoggingIn(false);

        if (response.status === StatusCodes.NOT_FOUND) {
            alert("Username salah!");
            return;
        }
        
        if (response.status === StatusCodes.UNAUTHORIZED) {
            alert("Username atau Password salah!");
            return;
        }

        // CHeck if still errors
        if (!response.ok) throw response;

            // if () Check if it is a defined error, or another unexpected error

            // const errorMessage = await response.json();
            // console.log(errorMessage);
            // alert(`${errorMessage.code}: ${errorMessage.message}`);

            // return;
            
        // const responseData: AccountData = await response.json();

        setClientAuthState({
            isAuthenticated: true,
            accountData: await response.json()
        });

        router.push("/dasbor");

        // alert("login success!");
    }

    function handleSubmit(ev: FormEvent) {
        ev.preventDefault();

        if (!username.current || !password.current) {
            // throw new Error?
            return;
        }

        authenticate(username.current.value, password.current.value);
    }

    return (
        <div className={"fullo-height flex items-center justify-center bg-gray-200 flex-grow" + (isLoggingIn ? " cursor-wait" : '')}>
            <div className="bg-white shadow p-8 rounded-xl">
                <h1 className="text-4xl font-bold tracking-tight text-center mb-6">Masuk</h1>
                <form onSubmit={handleSubmit}>
                    <Input name="username" type="text" title="Username" inputRef={username} disabled={isLoggingIn} />
                    <Input name="password" type="password" title="Kata Sandi" inputRef={password} disabled={isLoggingIn} />
                    <button type="submit" className="button disabled:opacity-50 block w-full mt-8" disabled={isLoggingIn}>
                        {isLoggingIn ? "Sedang memproses..." : "Masuk"}
                    </button>
                </form>
            </div>

            <style jsx>{`
                button:disabled {
                    opacity: 0.5;
                }
            `}</style>
        </div>
    )
}

export default LoginPage;

export const getServerSideProps = withPublicOnlyPage();