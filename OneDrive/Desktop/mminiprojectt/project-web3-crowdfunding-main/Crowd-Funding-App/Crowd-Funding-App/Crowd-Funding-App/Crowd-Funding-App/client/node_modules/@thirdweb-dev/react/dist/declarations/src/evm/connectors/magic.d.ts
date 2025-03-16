import { providers } from "ethers";
import type { LoginWithMagicLinkConfiguration, Magic as MagicInstance, MagicSDKAdditionalConfiguration } from "magic-sdk";
import { Chain, Connector } from "wagmi";
export interface MagicConnectorArguments extends MagicSDKAdditionalConfiguration {
    apiKey: string;
    doNotAutoConnect?: boolean;
    rpcUrls: Record<number, string>;
}
export declare class MagicConnector extends Connector {
    readonly id = "magic";
    readonly name = "Magic";
    readonly ready: boolean;
    options: MagicConnectorArguments;
    private configuration?;
    magic?: MagicInstance;
    getConfiguration(): LoginWithMagicLinkConfiguration | undefined;
    constructor(config: {
        chains?: Chain[];
        options: MagicConnectorArguments;
    });
    connect(isAutoConnect?: true): Promise<{
        account: string;
        provider: providers.Web3Provider;
        chain: {
            id: number;
            unsupported: boolean;
        };
    } | {
        account: undefined;
        provider: undefined;
        chain: undefined;
    }>;
    disconnect(): Promise<void>;
    switchChain(chainId: number): Promise<Chain | undefined>;
    getAccount(): Promise<string>;
    getChainId(): Promise<number>;
    getProvider(): providers.Web3Provider;
    getSigner(): Promise<providers.JsonRpcSigner>;
    isAuthorized(): Promise<boolean>;
    protected onAccountsChanged(accounts: string[]): void;
    protected isChainUnsupported(chainId: number): boolean;
    protected onChainChanged(chainId: string | number): void;
    protected onDisconnect(): void;
    setConfiguration(configuration?: LoginWithMagicLinkConfiguration): void;
}
/**
 * Hook for connecting to an email wallet using magic link.
 * This enables users without their own wallets to connect to your application and sign transactions securely using their email.
 *
 * ```javascript
 * import { useMagic } from "@thirdweb-dev/react"
 * ```
 *
 *
 * @example
 * Before using this hook, you first need to set up the magic configuration in your `ThirdwebProvider`, including your magic API key.
 *
 * ```javascript
 * // Add the magic configuration object to your wallet connectors
 * const connectors = [
 *   "metamask",
 *   "walletConnect",
 *   "walletLink",
 *   {
 *     name: "magic",
 *     options: {
 *       apiKey: "your-magic-api-key",
 *     }
 *   }
 * ]
 *
 * // Add the above to the walletConnectors prop of your <ThirdwebProvider />
 * const Provider = ({ children }) => (
 *   return (
 *     <ThirdwebProvider
 *       walletConnectors={connectors}
 *       // Specify remaining parameters
 *       ...
 *     >
 *       {children}
 *     </ThirdwebProvider>
 *   )
 * }
 * ```
 *
 * In order to use the hook to connect users with magic link, you just need to provide the users email to the connect function.
 *
 * You can setup the hook with the following configuration:
 * ```javascript
 * import { useMagic } from "@thirdweb-dev/react"
 * import { useState } from "react"
 *
 * const LoginWithMagicLink = () => {
 *   const connectWithMagic = useMagic()
 *   const [email, setEmail] = useState()
 *
 *   return (
 *     <div>
 *       <input value={email} onChange={(e) => setEmail(e.target.value)} />
 *       <button onClick={() => connectWithMagic({ email })}>Login</button>
 *     </div>
 *   )
 * }
 * ```
 *
 * @public
 */
export declare function useMagic(): (configuration: LoginWithMagicLinkConfiguration) => Promise<{
    data?: import("wagmi").ConnectorData<any> | undefined;
    error?: Error | undefined;
}>;
//# sourceMappingURL=magic.d.ts.map