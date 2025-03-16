import { LoginOptions, LoginPayload, GenerateOptions, VerifyOptions, AuthenticateOptions, User, Json } from "./schema";
import type { GenericAuthWallet } from "@thirdweb-dev/wallets";
export declare class ThirdwebAuth {
    private domain;
    private wallet;
    constructor(wallet: GenericAuthWallet, domain: string);
    updateWallet(wallet: GenericAuthWallet): void;
    login(options?: LoginOptions): Promise<LoginPayload>;
    verify(payload: LoginPayload, options?: VerifyOptions): Promise<string>;
    generate(payload: LoginPayload, options?: GenerateOptions): Promise<string>;
    /**
     * Authenticate With Token
     * @remarks Server-side function that authenticates the provided JWT token. This function verifies that
     * the provided authentication token is valid and returns the address of the authenticated wallet.
     *
     * @param domain - The domain of the server-side application doing authentication
     * @param token - The authentication token being used
     * @returns The address of the authenticated wallet
     *
     * @example
     * ```javascript
     * const domain = "example.com";
     * const loginPayload = await sdk.auth.login(domain);
     * const token = await sdk.auth.generateAuthToken(domain, loginPayload);
     *
     * // Authenticate the token and get the address of authenticating users wallet
     * const address = sdk.auth.authenticate(domain, token);
     * ```
     */
    authenticate<TSession extends Json = Json>(token: string, options?: AuthenticateOptions): Promise<User<TSession>>;
    private verifySignature;
    /**
     * Generates a EIP-4361 & CAIP-122 compliant message to sign based on the login payload
     */
    private generateMessage;
}
//# sourceMappingURL=auth.d.ts.map