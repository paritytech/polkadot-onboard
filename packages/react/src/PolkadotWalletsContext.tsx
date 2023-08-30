import type { BaseWallet, WalletAggregator } from '@polkadot-onboard/core';

import { createContext, useState, useMemo, useEffect, useContext } from 'react';

interface PolkadotWalletsContextProviderProps {
  children: any;
  walletAggregator: WalletAggregator;
  initialWaitMs?: number;
}

interface PolkadotWalletsContextProps {
  wallets: BaseWallet[] | undefined;
}

const PolkadotWalletsContext = createContext<PolkadotWalletsContextProps>({
  wallets: undefined,
});

export const useWallets = () => useContext(PolkadotWalletsContext);

export const PolkadotWalletsContextProvider = ({
  children,
  walletAggregator,
  initialWaitMs = 5 /* the default is set to 5ms to give extensions enough lead time to inject their providers */,
}: PolkadotWalletsContextProviderProps) => {
  const [wallets, setWallets] = useState<BaseWallet[] | undefined>();

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const wallets = await walletAggregator.getWallets();
      setWallets(wallets);
    }, initialWaitMs);

    return () => clearTimeout(timeoutId);
  }, [walletAggregator]);

  const contextData = useMemo(
    () => ({
      wallets,
    }),
    [wallets],
  );

  return <PolkadotWalletsContext.Provider value={contextData}>{children}</PolkadotWalletsContext.Provider>;
};
