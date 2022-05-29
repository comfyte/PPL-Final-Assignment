// Framework imports
import { useRouter } from "next/router";
import { useRef, useState, ChangeEvent, Dispatch, SetStateAction, FormEvent } from "react";

// Module imports
import { DividerLine } from "src/components/divider-line";
import { withPublicOnlyPage } from "src/utils/wrappers/server-side-public-only-page";

// Component imports
import Input from "components/auth-input";

// Util imports
import { useClientAuthContext } from "utils/client-auth-context"


type UsernameAvailability = {
    username: string,
    isAvailable: boolean | "checking",
    message: string | JSX.Element
}

export default function RegisterPage() {
    const { setClientAuthState } = useClientAuthContext();

    // Input states
    const [username,  setUsername ] = useState<string>('');
    const [password,  setPassword ] = useState<string>('');
    const [rPassword, setRPassword] = useState<string>('');

    // Flag states
    const [usernameAvailability, setUsernameAvailability] = useState<UsernameAvailability | null>(null);
    const [doesPasswordMatch, setPasswordMatch] = useState<boolean | null>(null);

    // Timer handle
    const usernameCheckTimer = useRef<NodeJS.Timeout | null>(null);

    function handleUsernameChange(ev: ChangeEvent<HTMLInputElement>) {
        const value = ev.target.value;
        setUsername(/*ev.target.*/value);
        
        if (usernameCheckTimer.current) {
        // Remove previous timer first, to avoid overlapping(?)
            clearTimeout(usernameCheckTimer.current);
            usernameCheckTimer.current = null;
        }

        if (!ev.target.validity.valid) {
            setUsernameAvailability(null);
            return;
        }

        // try {
        // TODO: Wrap these in a try-catch(-finally?) block

        async function checkUsernameAvailabilityEndpoint() {
            try {
                // console.log(`Checking for "${username}"...`)
                setUsernameAvailability({
                    username: value,
                    isAvailable: "checking",
                    message: <span className="text-gray-600">Memeriksa ketersediaan username <b>{value}</b>...</span>
                });

                const response = await fetch("/api/account/username-availability", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username: value })
                });

                if (!response.ok) {
                    throw response;
                }

                const json = await response.json();
                setUsernameAvailability({
                    ...json,
                    message: json.isAvailable ? (
                        <span className="text-green-600">Username <b>{value}</b> tersedia!</span>
                    ) : (
                        <span className="text-red-500">Maaf, username <b>{value}</b> tidak tersedia / telah digunakan oleh orang lain.</span>
                    )
                });
            }
            catch (err) {
                alert(`Terjadi eror dalam memeriksa ketersediaan username "${username}".`);
                throw err;
            }
        }

        usernameCheckTimer.current = setTimeout(checkUsernameAvailabilityEndpoint, 500)
    }

    function constrainPasswordMatch/*ing*/(value: string, valueToCompare: string) {
        if (value === '' || valueToCompare === '') {
            setPasswordMatch(null);
            return;
        }

        setPasswordMatch(value === valueToCompare);
    }

    function handleBothPasswordsChange(stateSetterFn: Dispatch<SetStateAction<string>>, valueToCompare: string) {
        return (ev: ChangeEvent<HTMLInputElement>) => {
            const value = ev.target.value;
            stateSetterFn(value);
            constrainPasswordMatch(value, valueToCompare);
        }
    }

    const [isProcessing, setProcessing] = useState<boolean>(false);

    const router = useRouter();

    async function register(username: string, password: string, passwordRepeat: string) {
        setProcessing(true);

        const apiResponse = await fetch("/api/account/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password, passwordRepeat })
        });

        if (!apiResponse.ok) {
            alert(`${apiResponse.status}: ${apiResponse.statusText}`);
            throw apiResponse;
        }

        // Logging-in phase
        const loginApiResponse = await fetch("/api/account/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });
        if (!loginApiResponse.ok) {
            alert(`${loginApiResponse.status}: ${loginApiResponse.statusText}`);
            throw loginApiResponse;
        }

        setClientAuthState({
            isAuthenticated: true,
            accountData: await loginApiResponse.json()
        });
        router.push("/dasbor");
    }

    function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        if ((!usernameAvailability?.isAvailable || !doesPasswordMatch) && ev.target instanceof HTMLFormElement) {
            const invalidElements = ev.target.querySelectorAll<HTMLInputElement>(".border-red-400"); // FIXME on the classname selecting
            invalidElements[0].focus();
            invalidElements.forEach(el => {
                el.animate(
                    [
                        { transform: "translateX(0.5rem)", offset: 0.25 },
                        { transform: "translateX(-0.5rem)", offset: 0.5 },
                        { transform: "translateX(0.5rem)", offset: 0.75 }
                    ],
                    {
                        duration: 400,
                        easing: "ease-out"
                    }
                )
            });
            return;
        }

        register(username, password, rPassword);
    }

    // Render
    return (
        <div className="flex items-center justify-center bg-gray-500 flex-grow p-8">
            <div className="bg-white shadow-lg p-8 rounded-xl flex items-center max-w-5xl flex-col md:flex-row">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-6">
                        Daftarkan dirimu di sini!
                    </h1>
                    {/* <p>
                        Tenang, kamu <b>tidak perlu memasukkan data pribadi apapun</b> di sini.
                        Kamu hanya perlu memberikan <i>username</i> yang unik.
                        Pembuatan akun ditujukan agar kamu bisa <b>mendapatkan <i>feedback</i> pada cerita yang kamu kirimkan</b>.
                    </p> */}
                    <p className="mt-4">
                        Untuk selengkapnya, silakan simak terlebih dahulu <a href="#" className="underline text-blue-500">kebijakan privasi kami</a> dan <a href="#" className="italic underline text-blue-500">terms and conditions</a> untuk lebih jelasnya.
                    </p>
                </div>
                <DividerLine className="bg-gray-300 flex-grow-0 flex-shrink-0 md:mx-10 md:my-0 my-10" />
                <form onSubmit={handleSubmit}>
                    <Input
                        name="username"
                        type="text"
                        title="Username"
                        required
                        autoFocus={true}
                        value={username}
                        onChange={handleUsernameChange}
                        invalid={usernameAvailability?.isAvailable === false}
                        helperMessage={usernameAvailability?.message}
                        disabled={isProcessing}
                    />

                    <Input
                        name="password"
                        type="password"
                        required
                        title="Kata Sandi"
                        value={password}
                        onChange={handleBothPasswordsChange(setPassword, rPassword)}
                        disabled={isProcessing}
                    />

                    <Input
                        name="repeat-password"
                        type="password"
                        title="Ulangi Kata Sandi"
                        required
                        value={rPassword}
                        onChange={handleBothPasswordsChange(setRPassword, password)}
                        invalid={doesPasswordMatch === false}
                        helperMessage={doesPasswordMatch === false && <span className="text-red-500">Password tidak sesuai!</span>}
                        disabled={isProcessing}
                    />

                    <button type="submit" className="button block w-full mt-8" disabled={isProcessing}>
                        {isProcessing ? "Sedang memproses..." : "Daftarkan dirimu"}
                    </button>
                </form>
            </div>
        </div>
    );
}

// export default RegisterPage;
export const getServerSideProps = withPublicOnlyPage();
