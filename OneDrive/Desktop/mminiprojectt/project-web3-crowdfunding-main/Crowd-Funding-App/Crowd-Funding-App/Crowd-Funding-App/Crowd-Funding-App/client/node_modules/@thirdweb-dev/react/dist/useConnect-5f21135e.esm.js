import invariant from 'tiny-invariant';
import { useContext, useConnect as useConnect$1 } from 'wagmi';

/**
 * for now just re-exported
 * @internal
 */
function useConnect() {
  const wagmiContext = useContext();
  invariant(wagmiContext, `useConnect() can only be used inside <ThirdwebProvider />. If you are using <ThirdwebSDKProvider /> you will have to use your own connection logic.`);
  return useConnect$1();
}

export { useConnect as u };
