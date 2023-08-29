import { WalletConnectConfiguration } from '@polkadot-onboard/wallet-connect';
import { PolkadotWalletsContextProvider } from '@polkadot-onboard/react';
import { WalletAggregator } from '@polkadot-onboard/core';
import { InjectedWalletProvider } from '@polkadot-onboard/injected-wallets';
import { WalletConnectProvider } from '@polkadot-onboard/wallet-connect';
import { extensionConfig } from '../extensionConfig';

import Wallets from './Wallets';
import { useState } from 'react';

const APP_NAME = 'Polkadot Demo';

const App = () => {
  const injectedWalletProvider = new InjectedWalletProvider(extensionConfig, APP_NAME);
  const walletConnectParams: WalletConnectConfiguration = {
    projectId: '4fae85e642724ee66587fa9f37b997e2',
    relayUrl: 'wss://relay.walletconnect.com',
    metadata: {
      name: 'Polkadot Demo',
      description: 'Polkadot Demo',
      url: '#',
      icons: ['https://walletconnect.com/walletconnect-logo.png'],
    },
    chainIds: ['polkadot:e143f23803ac50e8f6f8e62695d1ce9e', 'polkadot:91b171bb158e2d3848fa23a9f1c25182'],
    optionalChainIds: ['polkadot:67f9723393ef76214df0118c34bbbd3d', 'polkadot:7c34d42fc815d392057c78b49f2755c7'],
    onSessionDelete: () => {
      // do something when session is removed
    },
  };

  const walletConnectProvider = new WalletConnectProvider(walletConnectParams, APP_NAME);
  const walletAggregator = new WalletAggregator([injectedWalletProvider, walletConnectProvider]);
  const [showWallets, setShowWallets] = useState(false);

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
