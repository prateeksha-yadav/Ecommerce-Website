import { LoginOptions } from "@thirdweb-dev/auth";
/**
 * Hook to securely login to a backend with the connected wallet. The backend
 * authentication URL must be configured on the ThirdwebProvider.
 *
 * @returns - A function to invoke to login with the connected wallet, and an isLoading state.
 *
 * @beta
 */
export declare function useLogin(): {
    login: (options?: LoginOptions) => Promise<void>;
    isLoading: boolean;
};
//# sourceMappingURL=useLogin.d.ts.map