import type { BaseWallet, WalletAggregator } from '@polkadot-onboard/core';

import { createContext, useState, useMemo, useEffect, useContext } from 'react';

interface PolkadotWalletsContextProviderProps {
  children: any;
  walletAggregator: WalletAggregator;
}

interface PolkadotWalletsContextProps {
  wallets: BaseWallet[] | undefined;
}

const PolkadotWalletsContext = createContext<PolkadotWalletsContextProps>({
  wallets: undefined,
});

export const useWallets = () => useContext(PolkadotWalletsContext);

export const PolkadotWalletsContextProvider = ({ children, walletAggregator }: PolkadotWalletsContextProviderProps) => {
  const [wallets, setWallets] = useState<BaseWallet[] | undefined>();

  useEffect(() => {
    setWallets(walletAggregator.getWallets());
  }, [walletAggregator]);

  const contextData = useMemo(
    () => ({
      wallets,
    }),
    [wallets],
  );

  return <PolkadotWalletsContext.Provider value={contextData}>{children}</PolkadotWalletsContext.Provider>;
};
