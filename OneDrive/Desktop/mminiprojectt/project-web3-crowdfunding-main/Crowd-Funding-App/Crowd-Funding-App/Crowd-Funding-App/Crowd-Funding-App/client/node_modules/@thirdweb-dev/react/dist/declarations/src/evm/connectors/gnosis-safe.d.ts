import { Signer, ethers } from "ethers";
import { Chain, Connector, ConnectorData } from "wagmi";
export interface GnosisConnectorArguments {
    safeAddress: string;
    safeChainId: number;
}
export declare class GnosisSafeConnector extends Connector {
    static supportedChains: string[];
    supportedChains: string[];
    id: string;
    ready: boolean;
    name: string;
    previousConnector?: Connector<any>;
    private config?;
    private safeSigner?;
    constructor(config: {
        chains?: Chain[];
    });
    connect(): Promise<ConnectorData<any>>;
    isChainSupported(chainId: string | number): boolean;
    private createSafeSigner;
    disconnect(): Promise<void>;
    getAccount(): Promise<string>;
    getChainId(): Promise<number>;
    getProvider(): Promise<ethers.providers.Provider | undefined>;
    getSigner(): Promise<Signer>;
    isAuthorized(): Promise<boolean>;
    protected onAccountsChanged(accounts: string[]): void;
    protected isChainUnsupported(chainId: number): boolean;
    protected onChainChanged(chainId: string | number): void;
    protected onDisconnect(): void;
    setConfiguration(connector: Connector<any>, config: GnosisConnectorArguments): void;
}
/**
 * Hook for connecting to a Gnosis Safe. This enables multisig wallets to connect to your application and sing transactions.
 *
 * ```javascript
 * import { useGnosis } from "@thirdweb-dev/react"
 * ```
 *
 *
 * @example
 * ```javascript
 * import { useGnosis } from "@thirdweb-dev/react"
 *
 * const App = () => {
 *   const connectWithGnosis = useGnosis()
 *
 *   return (
 *     <button onClick={() => connectWithGnosis({ safeAddress: "0x...", safeChainId: 1 })}>
 *       Connect Gnosis Safe
 *     </button>
 *   )
 * }
 * ```
 *
 * @public
 */
export declare function useGnosis(): (config: GnosisConnectorArguments) => Promise<{
    data?: ConnectorData<any> | undefined;
    error?: Error | undefined;
}>;
//# sourceMappingURL=gnosis-safe.d.ts.map