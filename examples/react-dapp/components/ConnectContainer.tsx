import { useState } from 'react';
import { DotsamaWalletsContextProvider } from '@dotsama-wallets/react';
import { WalletAggregator } from '@dotsama-wallets/core';
import { InjectedWalletProvider } from '@dotsama-wallets/injected-wallets';
import { WalletConnectProvider } from '@dotsama-wallets/wallet-connect';
import { extensionConfig } from 'provider-configs/extensionConfig';
import styles from 'styles/Home.module.css';

import Wallets from './Wallets';

const APP_NAME = 'Dotsama Demo';

const ConnectContainer = () => {
  let injectedWalletProvider = new InjectedWalletProvider(extensionConfig, APP_NAME);
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
  let walletConnectProvider = new WalletConnectProvider(walletConnectParams, APP_NAME);
  let walletAggregator = new WalletAggregator([injectedWalletProvider, walletConnectProvider]);

  let [showWallets, setShowWallets] = useState(false);
  return (
    <DotsamaWalletsContextProvider walletAggregator={walletAggregator}>
      <div className={`${styles.grid}`}>
        {!showWallets && (
          <button
            className={`${styles.btn} ${styles.rounded}`}
            onClick={() => {
              setShowWallets(true);
            }}
          >
            Get Wallets
          </button>
        )}

        {showWallets && <Wallets />}
      </div>
    </DotsamaWalletsContextProvider>
  );
};

export default ConnectContainer;
