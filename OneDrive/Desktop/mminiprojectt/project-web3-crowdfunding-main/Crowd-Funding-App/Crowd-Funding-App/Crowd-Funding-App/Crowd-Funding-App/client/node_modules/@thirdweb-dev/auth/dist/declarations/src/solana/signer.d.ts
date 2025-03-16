import { Keypair, PublicKey } from "@solana/web3.js";
import type { Ecosystem, GenericAuthWallet } from "@thirdweb-dev/wallets";
export interface SolanaSigner {
    publicKey: PublicKey;
    signMessage(message: Uint8Array): Promise<Uint8Array>;
}
export declare class SignerWallet implements GenericAuthWallet {
    type: Ecosystem;
    private signer;
    constructor(signer: SolanaSigner);
    getAddress(): Promise<string>;
    signMessage(message: string): Promise<string>;
    verifySignature(message: string, signature: string, address: string): Promise<boolean>;
}
export declare class KeypairWallet extends SignerWallet {
    constructor(keypair: Keypair);
}
export declare class PrivateKeyWallet extends KeypairWallet {
    constructor(privateKey: string);
}
//# sourceMappingURL=signer.d.ts.map