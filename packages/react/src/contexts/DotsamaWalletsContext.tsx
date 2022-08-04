import { createContext, useState, useMemo, useCallback } from 'react';
import { getExtensions, ExtensionInfo, BasicExtensionInfo } from '@dotsama-wallets/core';

interface DotsamaWalletsContextProviderProps {
  children: any;
}

interface DotsamaWalletsContextProps {
  getExtensions: () => void;
  extensions: ExtensionInfo[];
  otherExtensions: BasicExtensionInfo[];
}

export const DotsamaWalletsContext = createContext<DotsamaWalletsContextProps>({
  getExtensions: () => {},
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

  const contextData = useMemo(
    () => ({
      getExtensions: fetchExtensions,
      extensions,
      otherExtensions,
    }),
    [fetchExtensions, extensions, otherExtensions],
  );

  return <DotsamaWalletsContext.Provider value={contextData}>{children}</DotsamaWalletsContext.Provider>;
};
