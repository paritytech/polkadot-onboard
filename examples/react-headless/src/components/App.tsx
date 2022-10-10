import { PolkadotWalletsContextProvider } from '@polkadot-onboard/react';
import { WalletAggregator } from '@polkadot-onboard/core';
import { InjectedWalletProvider } from '@polkadot-onboard/injected-wallets';
import { WalletConnectProvider } from '@polkadot-onboard/wallet-connect';
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
