import { _ as _defineProperty, T as ThirdwebAuth } from '../../dist/auth-1c9c8aaa.esm.js';
import * as ed25519 from '@noble/ed25519';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import 'ethers';
import 'uuid';
import 'zod';

class SignerWallet {
  constructor(signer) {
    _defineProperty(this, "type", "solana");
    _defineProperty(this, "signer", void 0);
    this.signer = signer;
  }
  async getAddress() {
    return this.signer.publicKey.toBase58();
  }
  async signMessage(message) {
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await this.signer.signMessage(encodedMessage);
    const signature = bs58.encode(signedMessage);
    return signature;
  }
  async verifySignature(message, signature, address) {
    return nacl.sign.detached.verify(new TextEncoder().encode(message), bs58.decode(signature), bs58.decode(address));
  }
}
class KeypairSigner {
  constructor(keypair) {
    _defineProperty(this, "keypair", void 0);
    _defineProperty(this, "publicKey", void 0);
    this.keypair = keypair;
    this.publicKey = keypair.publicKey;
  }
  async signMessage(message) {
    return ed25519.sync.sign(message, this.keypair.secretKey.slice(0, 32));
  }
}
class KeypairWallet extends SignerWallet {
  constructor(keypair) {
    super(new KeypairSigner(keypair));
  }
}
class PrivateKeyWallet extends KeypairWallet {
  constructor(privateKey) {
    super(Keypair.fromSecretKey(bs58.decode(privateKey)));
  }
}

const wallet = new KeypairWallet(Keypair.generate());
const authMap = new Map();
async function verifyLogin(domain, payload, options) {
  let auth;
  if (!authMap.has(domain)) {
    auth = new ThirdwebAuth(wallet, domain);
    authMap.set(domain, auth);
  } else {
    auth = authMap.get(domain);
  }
  try {
    const address = await auth.verify(payload, options);
    return {
      address,
      error: undefined
    };
  } catch (err) {
    return {
      address: undefined,
      error: err.message
    };
  }
}

export { KeypairWallet, PrivateKeyWallet, SignerWallet, verifyLogin };
