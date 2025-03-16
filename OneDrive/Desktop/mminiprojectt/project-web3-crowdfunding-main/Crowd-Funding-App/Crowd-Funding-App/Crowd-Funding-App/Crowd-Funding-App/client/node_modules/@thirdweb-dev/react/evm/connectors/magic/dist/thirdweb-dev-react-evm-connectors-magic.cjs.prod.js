'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var defineProperty = require('../../../../dist/defineProperty-6ca2d9a5.cjs.prod.js');
var useConnect = require('../../../../dist/useConnect-9749ad27.cjs.prod.js');
var ethers = require('ethers');
var invariant = require('tiny-invariant');
var wagmi = require('wagmi');

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

var invariant__default = /*#__PURE__*/_interopDefault(invariant);

const __IS_SERVER__ = typeof window === "undefined";
const LOCAL_STORAGE_KEY = "--magic-link:configuration";
class MagicConnector extends wagmi.Connector {
  getConfiguration() {
    if (__IS_SERVER__) {
      return undefined;
    }
    const config = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (config) {
      this.configuration = JSON.parse(config);
    }
    return this.configuration;
  }
  constructor(config) {
    super({
      ...config,
      options: config?.options
    });
    defineProperty._defineProperty(this, "id", "magic");
    defineProperty._defineProperty(this, "name", "Magic");
    defineProperty._defineProperty(this, "ready", __IS_SERVER__);
    defineProperty._defineProperty(this, "options", void 0);
    defineProperty._defineProperty(this, "configuration", void 0);
    defineProperty._defineProperty(this, "magic", void 0);
    this.options = config.options;
    if (!__IS_SERVER__) {
      this.ready = true;
      if (this.options.doNotAutoConnect || !this.getConfiguration()) {
        return;
      }
      this.connect(true);
    }
  }
  async connect(isAutoConnect) {
    const {
      apiKey,
      ...options
    } = this.options;
    const configuration = this.getConfiguration();
    const chains = Object.entries(this.options.rpcUrls);
    if (chains.length > 1) {
      console.warn(`Magic only supports connecting to one chain at a time. Using the first chain specified in rpcUrls: ${chains[0]}.`);
    }
    const [chainId, rpcUrl] = chains[0];
    this.options.network = {
      chainId: parseInt(chainId),
      rpcUrl
    };
    try {
      invariant__default["default"](configuration, "did you forget to set the configuration via: setConfiguration()?");
      if (isAutoConnect) {
        configuration.showUI = false;
      }
      return Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require('magic-sdk')); }).then(async m => {
        this.magic = new m.Magic(apiKey, options);
        await this.magic.auth.loginWithMagicLink(configuration);
        const provider = this.getProvider();
        if (provider.on) {
          provider.on("accountsChanged", this.onAccountsChanged);
          provider.on("chainChanged", this.onChainChanged);
          provider.on("disconnect", this.onDisconnect);
        }
        const account = await this.getAccount();
        const id = await this.getChainId();
        return {
          account,
          provider,
          chain: {
            id,
            unsupported: this.isChainUnsupported(id)
          }
        };
      });
    } catch (e) {
      if (!isAutoConnect) {
        throw e;
      }
      return {
        account: undefined,
        provider: undefined,
        chain: undefined
      };
    }
  }
  async disconnect() {
    const provider = this.getProvider();
    if (provider?.removeListener) {
      provider.removeListener("accountsChanged", this.onAccountsChanged);
      provider.removeListener("chainChanged", this.onChainChanged);
      provider.removeListener("disconnect", this.onDisconnect);
    }
    this.setConfiguration(undefined);
  }
  async switchChain(chainId) {
    invariant__default["default"](!this.isChainUnsupported(chainId), "chain is not supported");
    const provider = this.getProvider();
    if (provider?.removeListener) {
      provider.removeListener("accountsChanged", this.onAccountsChanged);
      provider.removeListener("chainChanged", this.onChainChanged);
      provider.removeListener("disconnect", this.onDisconnect);
    }
    this.options.network = {
      chainId,
      rpcUrl: this.options.rpcUrls[chainId]
    };
    await this.connect();
    this.onChainChanged(chainId);
    return this.chains.find(c => c.id === chainId);
  }
  async getAccount() {
    const signer = await this.getSigner();
    return await signer.getAddress();
  }
  async getChainId() {
    const signer = await this.getSigner();
    return await signer.getChainId();
  }
  getProvider() {
    invariant__default["default"](this.magic, "connector is not initialized");
    return new ethers.providers.Web3Provider(this.magic.rpcProvider);
  }
  async getSigner() {
    if (!this.magic) {
      await this.connect();
    }
    return this.getProvider().getSigner();
  }
  async isAuthorized() {
    try {
      const account = await this.getAccount();
      return !!account;
    } catch {
      return false;
    }
  }
  onAccountsChanged(accounts) {
    if (accounts.length === 0) {
      this.emit("disconnect");
    } else {
      this.emit("change", {
        account: ethers.utils.getAddress(accounts[0])
      });
    }
  }
  isChainUnsupported(chainId) {
    return !this.chains.some(x => x.id === chainId);
  }
  onChainChanged(chainId) {
    const id = wagmi.normalizeChainId(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit("change", {
      chain: {
        id,
        unsupported
      }
    });
  }
  onDisconnect() {
    this.emit("disconnect");
  }
  setConfiguration(configuration) {
    if (configuration) {
      this.configuration = configuration;
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(configuration));
    } else {
      this.configuration = undefined;
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }
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
function useMagic() {
  const wagmiContext = wagmi.useContext();
  invariant__default["default"](wagmiContext, `useMagic() can only be used inside <ThirdwebProvider />. If you are using <ThirdwebSDKProvider /> you will have to use your own wallet-connection logic.`);
  const [connectors, connect] = useConnect.useConnect();
  if (connectors.loading) {
    return () => Promise.reject("Magic connector not ready to be used, yet");
  }
  const connector = connectors.data.connectors.find(c => c.id === "magic");
  invariant__default["default"](connector, "Magic connector not found, please make sure it is provided to your <ThirdwebProvider />");
  return configuration => {
    connector.setConfiguration(configuration);
    return connect(connector);
  };
}

exports.MagicConnector = MagicConnector;
exports.useMagic = useMagic;
