import { ConnectionType } from 'libs/web3/web3.constants';
import {
  coinbaseWalletConnection,
  gnosisSafeConnection,
  injectedConnection,
  networkConnection,
  walletConnectConnection,
} from 'libs/web3/web3.connectors';

export const getConnection = (c: ConnectionType) => {
  switch (c) {
    case ConnectionType.INJECTED:
      return injectedConnection;
    case ConnectionType.COINBASE_WALLET:
      return coinbaseWalletConnection;
    case ConnectionType.WALLET_CONNECT:
      return walletConnectConnection;
    case ConnectionType.NETWORK:
      return networkConnection;
    case ConnectionType.GNOSIS_SAFE:
      return gnosisSafeConnection;
  }
};