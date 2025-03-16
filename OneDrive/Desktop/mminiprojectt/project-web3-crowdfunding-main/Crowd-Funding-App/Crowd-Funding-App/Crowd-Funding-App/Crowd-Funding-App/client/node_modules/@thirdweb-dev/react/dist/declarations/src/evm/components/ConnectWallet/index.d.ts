import { ThemeProviderProps } from "../shared/ThemeProvider";
import type { LoginOptions } from "@thirdweb-dev/auth";
import React from "react";
interface ConnectWalletProps extends ThemeProviderProps {
    auth?: {
        loginOptions?: LoginOptions;
        loginOptional?: boolean;
    };
    className?: string;
    btnTitle?: JSX.Element | string;
}
/**
 * A component that allows the user to connect their wallet.
 *
 * The button has to be wrapped in a `ThirdwebProvider` in order to function.
 *
 * @example
 * ```javascript
 * import { ConnectWallet } from '@thirdweb-dev/react';
 *
 * const App = () => {
 *  return (
 *   <div>
 *     <ConnectWallet />
 *   </div>
 * )
 * }
 * ```
 *
 *
 * @beta
 */
export declare const ConnectWallet: React.FC<ConnectWalletProps>;
export {};
//# sourceMappingURL=index.d.ts.map