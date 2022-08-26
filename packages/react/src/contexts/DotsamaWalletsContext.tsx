import { createContext, useState, useMemo, useEffect, useContext } from 'react';
import { BaseWallet, WalletAggregator } from '@dotsama-wallets/core';

interface DotsamaWalletsContextProviderProps {
  children: any;
  walletAggregator: WalletAggregator;
}

interface DotsamaWalletsContextProps {
  wallets: BaseWallet[];
}

const DotsamaWalletsContext = createContext<DotsamaWalletsContextProps>({
  wallets: [],
});

export const useWallets = () => useContext(DotsamaWalletsContext);

export const DotsamaWalletsContextProvider = ({ children, walletAggregator }: DotsamaWalletsContextProviderProps) => {
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

  return <DotsamaWalletsContext.Provider value={contextData}>{children}</DotsamaWalletsContext.Provider>;
};
