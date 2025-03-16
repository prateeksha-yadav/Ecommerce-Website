'use strict';

var invariant = require('tiny-invariant');
var wagmi = require('wagmi');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var invariant__default = /*#__PURE__*/_interopDefault(invariant);

/**
 * for now just re-exported
 * @internal
 */
function useConnect() {
  const wagmiContext = wagmi.useContext();
  invariant__default["default"](wagmiContext, `useConnect() can only be used inside <ThirdwebProvider />. If you are using <ThirdwebSDKProvider /> you will have to use your own connection logic.`);
  return wagmi.useConnect();
}

exports.useConnect = useConnect;
