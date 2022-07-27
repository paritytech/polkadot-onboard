import { InjectedWindow } from '@polkadot/extension-inject/types';
import React, { createContext, useState, useMemo, useCallback } from 'react';

import { BasicExtensionInfo, ExtensionInfo, supportedExtensions } from '../constants';

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

const DISALLOWED_EXTENSIONS: string[] = [];

export const DotsamaWalletsContextProvider = ({ children }: DotsamaWalletsContextProviderProps) => {
  const [extensions, setExtensions] = useState<ExtensionInfo[]>([]);
  const [otherExtensions, setOtherExtensions] = useState<BasicExtensionInfo[]>([]);

  const getExtensions = useCallback(async () => {
    const injectedWindow = window as Window & InjectedWindow;
    const knownExtensions: ExtensionInfo[] = [];
    const otherExtensions: BasicExtensionInfo[] = [];

    Object.keys(injectedWindow.injectedWeb3).forEach((extensionName) => {
      if (!DISALLOWED_EXTENSIONS.includes(extensionName)) {
        const foundExtension = supportedExtensions.find(({ name }) => name === extensionName);
        if (foundExtension) {
          knownExtensions.push({ ...injectedWindow.injectedWeb3[extensionName], ...foundExtension });
        } else {
          otherExtensions.push({ name: extensionName, ...injectedWindow.injectedWeb3[extensionName] });
        }
      }
    });

    setExtensions([...knownExtensions]);
    setOtherExtensions([...otherExtensions]);
  }, []);

  const contextData = useMemo(
    () => ({
      getExtensions,
      extensions,
      otherExtensions,
    }),
    [getExtensions, extensions, otherExtensions],
  );

  return <DotsamaWalletsContext.Provider value={contextData}>{children}</DotsamaWalletsContext.Provider>;
};
