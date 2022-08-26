import { DotsamaWalletsContextProvider } from '@dotsama-wallets/react';
import { WalletAggregator } from '@dotsama-wallets/core';
import { InjectedWalletProvider } from '@dotsama-wallets/injected-wallets';
import { extensionConfig } from '../extensionConfig';

import Wallets from './Wallets';
import { useState } from 'react';

const App = () => {
  let injectedWalletProvider = new InjectedWalletProvider(extensionConfig, 'Dotsama Demo');
  let walletAggregator = new WalletAggregator([injectedWalletProvider]);
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
