import { createContext, useState, useMemo, useCallback } from 'react';
import { getExtensions, ExtensionInfo, BasicExtensionInfo } from '@dotsama-wallets/core';
import { Injected, InjectedAccount } from '@polkadot/extension-inject/types';

interface DotsamaWalletsContextProviderProps {
  children: any;
}

interface DotsamaWalletsContextProps {
  getExtensions: () => void;
  connectToExtension: (extension: ExtensionInfo) => Promise<{ injectedExtension: Injected, accounts: InjectedAccount[] }>;
  extensions: ExtensionInfo[];
  otherExtensions: BasicExtensionInfo[];
}

export const DotsamaWalletsContext = createContext<DotsamaWalletsContextProps>({
  getExtensions: () => {},
  connectToExtension: async () => ({ injectedExtension: {} as Injected, accounts: []}),
  extensions: [],
  otherExtensions: [],
});

export const DotsamaWalletsContextProvider = ({ children }: DotsamaWalletsContextProviderProps) => {
  const [extensions, setExtensions] = useState<ExtensionInfo[]>([]);
  const [otherExtensions, setOtherExtensions] = useState<BasicExtensionInfo[]>([]);

  const fetchExtensions = useCallback(async () => {
    const { knownExtensions, otherExtensions } = getExtensions();

    setExtensions([...knownExtensions]);
    setOtherExtensions([...otherExtensions]);
  }, []);

  const connectToExtension = useCallback(async (extension: ExtensionInfo) => {
    // TODO move app name to config later
    // TODO extension connection should be separate from getting accounts, but for that will need ping functionality to get isConnected status
    // currently we don't have that yet
    // add try catches
    const injectedExtension = await extension.enable('dotsama-wallets');
    const accounts = await injectedExtension.accounts.get();

    return { injectedExtension, accounts };
  }, [extensions, otherExtensions]);

  const contextData = useMemo(
    () => ({
      getExtensions: fetchExtensions,
      connectToExtension,
      extensions,
      otherExtensions,
    }),
    [fetchExtensions, connectToExtension, extensions, otherExtensions],
  );

  return <DotsamaWalletsContext.Provider value={contextData}>{children}</DotsamaWalletsContext.Provider>;
};
