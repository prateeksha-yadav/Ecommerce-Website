import { utils, BigNumber } from 'ethers';
import { v4 } from 'uuid';
import { z } from 'zod';

function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

const AddressSchema = z.string().refine(arg => utils.isAddress(arg), out => {
  return {
    message: `${out} is not a valid address`
  };
});
const RawDateSchema = z.date().transform(i => {
  return BigNumber.from(Math.floor(i.getTime() / 1000));
});
const AccountTypeSchema = z.union([z.literal("evm"), z.literal("solana")]);
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
const JsonSchema = z.lazy(() => z.union([literalSchema, z.array(JsonSchema), z.record(JsonSchema)]), {
  invalid_type_error: "Provided value was not valid JSON"
});

/**
 * @internal
 */
const LoginOptionsSchema = z.object({
  domain: z.string().optional(),
  statement: z.string().optional(),
  uri: z.string().optional(),
  version: z.string().optional(),
  chainId: z.string().optional(),
  nonce: z.string().optional(),
  expirationTime: z.date().optional(),
  invalidBefore: z.date().optional(),
  resources: z.array(z.string()).optional()
}).optional();

/**
 * @internal
 */
const LoginPayloadDataSchema = z.object({
  type: AccountTypeSchema,
  domain: z.string(),
  address: z.string(),
  statement: z.string().default("Please ensure that the domain above matches the URL of the current website."),
  uri: z.string().optional(),
  version: z.string().default("1"),
  chain_id: z.string().optional(),
  nonce: z.string().default(v4()),
  issued_at: z.date().default(new Date()).transform(d => d.toISOString()),
  expiration_time: z.date().transform(d => d.toISOString()),
  invalid_before: z.date().default(new Date()).transform(d => d.toISOString()),
  resources: z.array(z.string()).optional()
});

/**
 * @internal
 */
const LoginPayloadSchema = z.object({
  payload: LoginPayloadDataSchema,
  signature: z.string()
});

/**
 * @internal
 */
const VerifyOptionsSchemaRequired = z.object({
  domain: z.string().optional(),
  statement: z.string().optional(),
  uri: z.string().optional(),
  version: z.string().optional(),
  chainId: z.string().optional(),
  validateNonce: z.function().args(z.string()).optional(),
  resources: z.array(z.string()).optional()
});

/**
 * @internal
 */
const VerifyOptionsSchema = VerifyOptionsSchemaRequired.optional();

/**
 * @internal
 */
const GenerateOptionsSchema = z.object({
  domain: z.string().optional(),
  tokenId: z.string().optional(),
  expirationTime: z.date().optional(),
  invalidBefore: z.date().optional(),
  session: z.union([JsonSchema, z.function().args(z.string())]).optional(),
  verifyOptions: VerifyOptionsSchemaRequired.omit({
    domain: true
  }).optional()
}).optional();

/**
 * @internal
 */
const AuthenticationPayloadDataSchema = z.object({
  iss: z.string(),
  sub: z.string(),
  aud: z.string(),
  exp: RawDateSchema.transform(b => b.toNumber()),
  nbf: RawDateSchema.transform(b => b.toNumber()),
  iat: RawDateSchema.transform(b => b.toNumber()),
  jti: z.string().default(v4()),
  ctx: JsonSchema.optional()
});

/**
 * @internal
 */
const AuthenticationPayloadSchema = z.object({
  payload: AuthenticationPayloadDataSchema,
  signature: z.string()
});

/**
 * @internal
 */
const AuthenticateOptionsSchema = z.object({
  domain: z.string().optional(),
  validateTokenId: z.function().args(z.string()).optional()
}).optional();

/**
 * @public
 */

const LoginPayloadOutputSchema = LoginPayloadSchema.extend({
  payload: LoginPayloadDataSchema.extend({
    issued_at: z.string(),
    expiration_time: z.string(),
    invalid_before: z.string()
  })
});

/**
 * @internal
 */
const isBrowser = () => typeof window !== "undefined";

class ThirdwebAuth {
  constructor(wallet, domain) {
    _defineProperty(this, "domain", void 0);
    _defineProperty(this, "wallet", void 0);
    this.wallet = wallet;
    this.domain = domain;
  }
  updateWallet(wallet) {
    this.wallet = wallet;
  }
  async login(options) {
    const parsedOptions = LoginOptionsSchema.parse(options);
    let chainId = parsedOptions?.chainId;
    if (!chainId && this.wallet.getChainId) {
      try {
        chainId = (await this.wallet.getChainId()).toString();
      } catch {
        // ignore error
      }
    }
    const payloadData = LoginPayloadDataSchema.parse({
      type: this.wallet.type,
      domain: parsedOptions?.domain || this.domain,
      address: await this.wallet.getAddress(),
      statement: parsedOptions?.statement,
      version: parsedOptions?.version,
      uri: parsedOptions?.uri || (isBrowser() ? window.location.origin : undefined),
      chain_id: chainId,
      nonce: parsedOptions?.nonce,
      expiration_time: parsedOptions?.expirationTime || new Date(Date.now() + 1000 * 60 * 5),
      invalid_before: parsedOptions?.invalidBefore,
      resources: parsedOptions?.resources
    });
    const message = this.generateMessage(payloadData);
    const signature = await this.wallet.signMessage(message);
    return {
      payload: payloadData,
      signature
    };
  }
  async verify(payload, options) {
    const parsedOptions = VerifyOptionsSchema.parse(options);
    if (payload.payload.type !== this.wallet.type) {
      throw new Error(`Expected chain type '${this.wallet.type}' does not match chain type on payload '${payload.payload.type}'`);
    }

    // Check that the intended domain matches the domain of the payload
    const domain = parsedOptions?.domain || this.domain;
    if (payload.payload.domain !== domain) {
      throw new Error(`Expected domain '${domain}' does not match domain on payload '${payload.payload.domain}'`);
    }

    // Check that the payload statement matches the expected statement
    if (parsedOptions?.statement) {
      if (payload.payload.statement !== parsedOptions.statement) {
        throw new Error(`Expected statement '${parsedOptions.statement}' does not match statement on payload '${payload.payload.statement}'`);
      }
    }

    // Check that the intended URI matches the URI of the payload
    if (parsedOptions?.uri) {
      if (payload.payload.uri !== parsedOptions.uri) {
        throw new Error(`Expected URI '${parsedOptions.uri}' does not match URI on payload '${payload.payload.uri}'`);
      }
    }

    // Check that the intended version matches the version of the payload
    if (parsedOptions?.version) {
      if (payload.payload.version !== parsedOptions.version) {
        throw new Error(`Expected version '${parsedOptions.version}' does not match version on payload '${payload.payload.version}'`);
      }
    }

    // Check that the intended chain ID matches the chain ID of the payload
    if (parsedOptions?.chainId) {
      if (payload.payload.chain_id !== parsedOptions.chainId) {
        throw new Error(`Expected chain ID '${parsedOptions.chainId}' does not match chain ID on payload '${payload.payload.chain_id}'`);
      }
    }

    // Check that the payload nonce is valid
    if (parsedOptions?.validateNonce !== undefined) {
      try {
        await parsedOptions.validateNonce(payload.payload.nonce);
      } catch (err) {
        throw new Error(`Login request nonce is invalid`);
      }
    }

    // Check that it isn't before the invalid before time
    const currentTime = new Date();
    if (currentTime < new Date(payload.payload.invalid_before)) {
      throw new Error(`Login request is not yet valid`);
    }

    // Check that the payload hasn't expired
    if (currentTime > new Date(payload.payload.expiration_time)) {
      throw new Error(`Login request has expired`);
    }

    // Check that the specified resources are present on the payload
    if (parsedOptions?.resources) {
      const missingResources = parsedOptions.resources.filter(resource => !payload.payload.resources?.includes(resource));
      if (missingResources.length > 0) {
        throw new Error(`Login request is missing required resources: ${missingResources.join(", ")}`);
      }
    }

    // Check that the signing address is the claimed wallet address
    const message = this.generateMessage(payload.payload);
    const chainId = this.wallet.type === "evm" && payload.payload.chain_id ? parseInt(payload.payload.chain_id) : undefined;
    const verified = await this.verifySignature(message, payload.signature, payload.payload.address, chainId);
    if (!verified) {
      throw new Error(`Signer address does not match payload address '${payload.payload.address.toLowerCase()}'`);
    }
    return payload.payload.address;
  }
  async generate(payload, options) {
    if (isBrowser()) {
      throw new Error("Authentication tokens should not be generated in the browser, as they must be signed by a server-side admin wallet.");
    }
    const parsedOptions = GenerateOptionsSchema.parse(options);
    const domain = parsedOptions?.domain || this.domain;
    const userAddress = await this.verify(payload, {
      domain,
      ...parsedOptions?.verifyOptions
    });
    let session = undefined;
    if (typeof parsedOptions?.session === "function") {
      const sessionTrigger = await parsedOptions.session(userAddress);
      if (sessionTrigger) {
        session = sessionTrigger;
      }
    } else {
      session = parsedOptions?.session;
    }
    const adminAddress = await this.wallet.getAddress();
    const payloadData = AuthenticationPayloadDataSchema.parse({
      iss: adminAddress,
      sub: userAddress,
      aud: domain,
      nbf: parsedOptions?.invalidBefore || new Date(),
      exp: parsedOptions?.expirationTime || new Date(Date.now() + 1000 * 60 * 60 * 5),
      iat: new Date(),
      jti: parsedOptions?.tokenId,
      ctx: session
    });
    const message = JSON.stringify(payloadData);
    const signature = await this.wallet.signMessage(message);

    // Header used for JWT token specifying hash algorithm
    const header = {
      // Specify ECDSA with SHA-256 for hashing algorithm
      alg: "ES256",
      typ: "JWT"
    };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64");
    const encodedData = Buffer.from(JSON.stringify(payloadData)).toString("base64").replace(/=/g, "");
    const encodedSignature = Buffer.from(signature).toString("base64");

    // Generate a JWT token with base64 encoded header, payload, and signature
    const token = `${encodedHeader}.${encodedData}.${encodedSignature}`;
    return token;
  }

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
  async authenticate(token, options) {
    if (isBrowser()) {
      throw new Error("Should not authenticate tokens in the browser, as they must be verified by the server-side admin wallet.");
    }
    const parsedOptions = AuthenticateOptionsSchema.parse(options);
    const domain = parsedOptions?.domain || this.domain;
    const encodedPayload = token.split(".")[1];
    const encodedSignature = token.split(".")[2];
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64").toString());
    const signature = Buffer.from(encodedSignature, "base64").toString();

    // Check that the payload unique ID is valid
    if (parsedOptions?.validateTokenId !== undefined) {
      try {
        await parsedOptions.validateTokenId(payload.jti);
      } catch (err) {
        throw new Error(`Token ID is invalid`);
      }
    }

    // Check that the token audience matches the domain
    if (payload.aud !== domain) {
      throw new Error(`Expected token to be for the domain '${domain}', but found token with domain '${payload.aud}'`);
    }

    // Check that the token is past the invalid before time
    const currentTime = Math.floor(new Date().getTime() / 1000);
    if (currentTime < payload.nbf) {
      throw new Error(`This token is invalid before epoch time '${payload.nbf}', current epoch time is '${currentTime}'`);
    }

    // Check that the token hasn't expired
    if (currentTime > payload.exp) {
      throw new Error(`This token expired at epoch time '${payload.exp}', current epoch time is '${currentTime}'`);
    }

    // Check that the connected wallet matches the token issuer
    const connectedAddress = await this.wallet.getAddress();
    if (connectedAddress.toLowerCase() !== payload.iss.toLowerCase()) {
      throw new Error(`Expected the connected wallet address '${connectedAddress}' to match the token issuer address '${payload.iss}'`);
    }
    let chainId = undefined;
    if (this.wallet.getChainId) {
      try {
        chainId = await this.wallet.getChainId();
      } catch {
        // ignore error
      }
    }
    const verified = await this.verifySignature(JSON.stringify(payload), signature, connectedAddress, chainId);
    if (!verified) {
      throw new Error(`The connected wallet address '${connectedAddress}' did not sign the token`);
    }
    return {
      address: payload.sub,
      session: payload.ctx
    };
  }
  async verifySignature(message, signature, address, chainId) {
    return this.wallet.verifySignature(message, signature, address, chainId);
  }

  /**
   * Generates a EIP-4361 & CAIP-122 compliant message to sign based on the login payload
   */
  generateMessage(payload) {
    const typeField = payload.type === "evm" ? "Ethereum" : "Solana";
    const header = `${payload.domain} wants you to sign in with your ${typeField} account:`;
    let prefix = [header, payload.address].join("\n");
    prefix = [prefix, payload.statement].join("\n\n");
    if (payload.statement) {
      prefix += "\n";
    }
    const suffixArray = [];
    if (payload.uri) {
      const uriField = `URI: ${payload.uri}`;
      suffixArray.push(uriField);
    }
    const versionField = `Version: ${payload.version}`;
    suffixArray.push(versionField);
    if (payload.chain_id) {
      const chainField = `Chain ID: ` + payload.chain_id || "1";
      suffixArray.push(chainField);
    }
    const nonceField = `Nonce: ${payload.nonce}`;
    suffixArray.push(nonceField);
    const issuedAtField = `Issued At: ${payload.issued_at}`;
    suffixArray.push(issuedAtField);
    const expiryField = `Expiration Time: ${payload.expiration_time}`;
    suffixArray.push(expiryField);
    if (payload.invalid_before) {
      const invalidBeforeField = `Not Before: ${payload.invalid_before}`;
      suffixArray.push(invalidBeforeField);
    }
    if (payload.resources) {
      suffixArray.push([`Resources:`, ...payload.resources.map(x => `- ${x}`)].join("\n"));
    }
    const suffix = suffixArray.join("\n");
    return [prefix, suffix].join("\n");
  }
}

export { AddressSchema as A, GenerateOptionsSchema as G, LoginOptionsSchema as L, RawDateSchema as R, ThirdwebAuth as T, VerifyOptionsSchema as V, _defineProperty as _, AccountTypeSchema as a, LoginPayloadDataSchema as b, LoginPayloadSchema as c, AuthenticationPayloadDataSchema as d, AuthenticationPayloadSchema as e, AuthenticateOptionsSchema as f, LoginPayloadOutputSchema as g };
