import { DotsamaWalletsContextProvider } from '@dotsama-wallets/react';
import { WalletAggregator } from '@dotsama-wallets/core';
import { InjectedWalletProvider } from '@dotsama-wallets/injected-wallets';
import { WalletConnectProvider } from '@dotsama-wallets/wallet-connect';
import { extensionConfig } from '../extensionConfig';

import Wallets from './Wallets';
import { useState } from 'react';

const App = () => {
  let injectedWalletProvider = new InjectedWalletProvider(extensionConfig, 'Dotsama Demo');
  let walletConnectParams = {
    projectId: '4fae85e642724ee66587fa9f37b997e2',
    relayUrl: 'wss://relay.walletconnect.com',
    metadata: {
      name: 'Dotsama Demo',
      description: 'Dotsama Demo',
      url: '#',
      icons: ['https://walletconnect.com/walletconnect-logo.png'],
    },
  };
  let walletConnectProvider = new WalletConnectProvider(walletConnectParams);
  let walletAggregator = new WalletAggregator([injectedWalletProvider, walletConnectProvider]);
  let [showWallets, setShowWallets] = useState(false);
  return (
    <DotsamaWalletsContextProvider walletAggregator={walletAggregator}>
      <button
        onClick={() => {
          setShowWallets(true);
        }}
      >
        get wallets
      </button>
      {showWallets && <Wallets />}
    </DotsamaWalletsContextProvider>
  );
};

export default App;
