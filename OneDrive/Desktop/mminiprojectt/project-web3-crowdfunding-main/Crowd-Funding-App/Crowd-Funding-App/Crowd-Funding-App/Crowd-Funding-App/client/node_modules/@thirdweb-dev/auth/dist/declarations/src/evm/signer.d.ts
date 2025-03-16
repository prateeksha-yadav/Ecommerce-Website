import type { Ecosystem, GenericAuthWallet } from "@thirdweb-dev/wallets";
import { ethers } from "ethers";
export declare const checkContractWalletSignature: (message: string, signature: string, address: string, chainId: number) => Promise<boolean>;
export declare class SignerWallet implements GenericAuthWallet {
    #private;
    type: Ecosystem;
    constructor(signer: ethers.Signer);
    getAddress(): Promise<string>;
    getChainId(): Promise<number>;
    signMessage(message: string): Promise<string>;
    verifySignature(message: string, signature: string, address: string, chainId?: number): Promise<boolean>;
}
export declare class PrivateKeyWallet extends SignerWallet {
    constructor(privateKey: string);
}
//# sourceMappingURL=signer.d.ts.map