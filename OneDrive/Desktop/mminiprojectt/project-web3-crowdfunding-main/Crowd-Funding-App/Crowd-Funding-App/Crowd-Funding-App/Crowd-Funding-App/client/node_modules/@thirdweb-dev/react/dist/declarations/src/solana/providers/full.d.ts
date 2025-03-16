import type { WalletAdapter } from "@solana/wallet-adapter-base";
import { ThirdwebAuthConfig } from "@thirdweb-dev/react-core/solana";
import { Network } from "@thirdweb-dev/sdk/solana";
import { PropsWithChildren } from "react";
interface ThirdwebProviderProps {
    network: Network;
    wallets?: WalletAdapter[];
    autoConnect?: boolean;
    authConfig?: ThirdwebAuthConfig;
}
/**
 * Gives access to the ThirdwebSDK instance and other useful hooks to the rest of the app.
 * Requires to be wrapped with a ConnectionProvider and a WalletProvider from @solana/wallet-adapter-react.
 * @example
 * ```tsx
 * import { ThirdwebProvider } from "@thirdweb-dev/react/solana";
 *
 * const App = () => {
 *  return (
 *     <ThirdwebProvider network="devnet">
 *       <YourApp />
 *     </ThirdwebProvider>
 * )};
 * ```
 * @beta
 */
export declare const ThirdwebProvider: React.FC<PropsWithChildren<ThirdwebProviderProps>>;
/**
 * @internal
 */
export declare const ThirdwebWrapperProvider: React.FC<PropsWithChildren<{
    network?: Network;
    authConfig?: ThirdwebAuthConfig;
}>>;
export {};
//# sourceMappingURL=full.d.ts.map