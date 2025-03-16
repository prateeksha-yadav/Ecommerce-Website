'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var auth = require('../../dist/auth-d33692f5.cjs.prod.js');
var ed25519 = require('@noble/ed25519');
var web3_js = require('@solana/web3.js');
var bs58 = require('bs58');
var nacl = require('tweetnacl');
require('ethers');
require('uuid');
require('zod');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var ed25519__namespace = /*#__PURE__*/_interopNamespace(ed25519);
var bs58__default = /*#__PURE__*/_interopDefault(bs58);
var nacl__default = /*#__PURE__*/_interopDefault(nacl);

class SignerWallet {
  constructor(signer) {
    auth._defineProperty(this, "type", "solana");
    auth._defineProperty(this, "signer", void 0);
    this.signer = signer;
  }
  async getAddress() {
    return this.signer.publicKey.toBase58();
  }
  async signMessage(message) {
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await this.signer.signMessage(encodedMessage);
    const signature = bs58__default["default"].encode(signedMessage);
    return signature;
  }
  async verifySignature(message, signature, address) {
    return nacl__default["default"].sign.detached.verify(new TextEncoder().encode(message), bs58__default["default"].decode(signature), bs58__default["default"].decode(address));
  }
}
class KeypairSigner {
  constructor(keypair) {
    auth._defineProperty(this, "keypair", void 0);
    auth._defineProperty(this, "publicKey", void 0);
    this.keypair = keypair;
    this.publicKey = keypair.publicKey;
  }
  async signMessage(message) {
    return ed25519__namespace.sync.sign(message, this.keypair.secretKey.slice(0, 32));
  }
}
class KeypairWallet extends SignerWallet {
  constructor(keypair) {
    super(new KeypairSigner(keypair));
  }
}
class PrivateKeyWallet extends KeypairWallet {
  constructor(privateKey) {
    super(web3_js.Keypair.fromSecretKey(bs58__default["default"].decode(privateKey)));
  }
}

const wallet = new KeypairWallet(web3_js.Keypair.generate());
const authMap = new Map();
async function verifyLogin(domain, payload, options) {
  let auth$1;
  if (!authMap.has(domain)) {
    auth$1 = new auth.ThirdwebAuth(wallet, domain);
    authMap.set(domain, auth$1);
  } else {
    auth$1 = authMap.get(domain);
  }
  try {
    const address = await auth$1.verify(payload, options);
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

exports.KeypairWallet = KeypairWallet;
exports.PrivateKeyWallet = PrivateKeyWallet;
exports.SignerWallet = SignerWallet;
exports.verifyLogin = verifyLogin;
