import { createContext, useContext, useEffect } from "react";
import { AuthInfo } from "../models/auth";

type AuthContextType = {
    clientAuthState: AuthInfo | undefined;
    setClientAuthState: (newAuthInfo: AuthInfo) => void
};

const clientAuthContext = createContext<AuthContextType>({
    clientAuthState: undefined,
    setClientAuthState: () => {}
});

const { Provider: ClientAuthProvider, Consumer: ClientAuthConsumer } = clientAuthContext;

// export { AuthContext, AuthProvider, AuthConsumer };

// export const { Provider: AuthProvider, Consumer: AuthConsumer } = authContext;
const useClientAuthContext = () => useContext(clientAuthContext);

function useSyncClientAuthState(newValue: AuthInfo) {
    const { setClientAuthState } = useClientAuthContext();

    return useEffect(() => {
        setClientAuthState(newValue);
    }, []);
    
}

export { clientAuthContext, useClientAuthContext, useSyncClientAuthState as useSyncAuthState, ClientAuthProvider, ClientAuthConsumer };