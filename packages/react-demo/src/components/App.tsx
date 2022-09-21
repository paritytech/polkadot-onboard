import { PolkadotWalletsContextProvider } from '@polkadot-wallets/react';
import { WalletAggregator } from '@polkadot-wallets/core';
import { InjectedWalletProvider } from '@polkadot-wallets/injected-wallets';
import { WalletConnectProvider } from '@polkadot-wallets/wallet-connect';
import { extensionConfig } from '../extensionConfig';

import Wallets from './Wallets';
import { useState } from 'react';

const APP_NAME = 'Polkadot Demo';

const App = () => {
  let injectedWalletProvider = new InjectedWalletProvider(extensionConfig, APP_NAME);
  let walletConnectParams = {
    projectId: '4fae85e642724ee66587fa9f37b997e2',
    relayUrl: 'wss://relay.walletconnect.com',
    metadata: {
      name: 'Polkadot Demo',
      description: 'Polkadot Demo',
      url: '#',
      icons: ['https://walletconnect.com/walletconnect-logo.png'],
    },
  };
  let walletConnectProvider = new WalletConnectProvider(walletConnectParams, APP_NAME);
  let walletAggregator = new WalletAggregator([injectedWalletProvider, walletConnectProvider]);
  let [showWallets, setShowWallets] = useState(false);
  return (
    <PolkadotWalletsContextProvider walletAggregator={walletAggregator}>
      <button
        onClick={() => {
          setShowWallets(true);
        }}
      >
        get wallets
      </button>
      {showWallets && <Wallets />}
    </PolkadotWalletsContextProvider>
  );
};

export default App;
