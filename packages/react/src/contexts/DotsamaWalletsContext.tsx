import { createContext, useState, useMemo, useCallback } from 'react';
import { getExtensions, ExtensionInfo, BasicExtensionInfo } from '@dotsama-wallets/core';
import { Injected, InjectedAccount } from '@polkadot/extension-inject/types';

interface DotsamaWalletsContextProviderProps {
  children: any;
}

interface DotsamaWalletsContextProps {
  setupWallets: () => void;
  connectToExtension: (appName: string, extension: ExtensionInfo) => Promise<{ injectedExtension: Injected, accounts: InjectedAccount[] }>;
  extensions: ExtensionInfo[];
  otherExtensions: BasicExtensionInfo[];
}

export const DotsamaWalletsContext = createContext<DotsamaWalletsContextProps>({
  setupWallets: () => {},
  connectToExtension: async () => ({ injectedExtension: {} as Injected, accounts: []}),
  extensions: [],
  otherExtensions: [],
});

export const DotsamaWalletsContextProvider = ({ children }: DotsamaWalletsContextProviderProps) => {
  const [extensions, setExtensions] = useState<ExtensionInfo[]>([]);
  const [otherExtensions, setOtherExtensions] = useState<BasicExtensionInfo[]>([]);

  const connectToExtension = useCallback(async (appName: string, extension: ExtensionInfo) => {
    // TODO extension connection should be separate from getting accounts, but for that will need ping functionality to get isConnected status
    // currently we don't have that yet
    // add try catches
    const injectedExtension = await extension.enable(appName);
    const accounts = await injectedExtension.accounts.get();

    return { injectedExtension, accounts };
  }, [extensions, otherExtensions]);

  // initializer, gets all the extensions
  const setupWallets = () => {
    const { knownExtensions, otherExtensions } = getExtensions();
    // const walletConnect = setupWalletConnect();

    setExtensions([...knownExtensions]); // TODO: potentially can be [...knownExtensions, walletConnect]
    setOtherExtensions([...otherExtensions]);
  }

  const contextData = useMemo(
    () => ({
      setupWallets,
      connectToExtension,
      extensions,
      otherExtensions,
    }),
    [setupWallets, connectToExtension, extensions, otherExtensions],
  );

  return <DotsamaWalletsContext.Provider value={contextData}>{children}</DotsamaWalletsContext.Provider>;
};
