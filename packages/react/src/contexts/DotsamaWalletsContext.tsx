import { createContext, useState, useMemo, useEffect, useContext } from 'react';
import { BaseWallet, WalletAggregator } from '@polkadot-wallets/core';

interface PolkadotWalletsContextProviderProps {
  children: any;
  walletAggregator: WalletAggregator;
}

interface PolkadotWalletsContextProps {
  wallets: BaseWallet[];
}

const PolkadotWalletsContext = createContext<PolkadotWalletsContextProps>({
  wallets: [],
});

export const useWallets = () => useContext(PolkadotWalletsContext);

export const PolkadotWalletsContextProvider = ({ children, walletAggregator }: PolkadotWalletsContextProviderProps) => {
  const [wallets, setWallets] = useState<BaseWallet[]>([]);

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
