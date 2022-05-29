// Framework imports
import { AuthInfo } from "../models/auth";


// export function useClientSideAuthCheck(authInfo: AuthInfo, redirectionTarget?: string) {
//     console.log("ucsac run!");

//     // Return and wait until the next rerender caused by state change
//     if (!authInfo) {
//         return;
//     }

//     const router = useRouter();

//     useEffect(() => {
//     if (!authInfo.isAuthenticated) {
//         router.push(redirectionTarget || "/akun/masuk");
//     }
// }, []);
// }

export async function fetchAuthInfo(): Promise<AuthInfo> {
    const response = await fetch("/api/account/get-auth-info", {
        credentials: "include"
    });
    if (!response.ok) {
        alert("Terjadi galat dalam memperoleh informasi akun.");
        throw response;
        // return;
    }

    // const responseData: AuthInfo = await response.json();
    return await response.json();
}