import { InjectedWindow } from '@polkadot/extension-inject/types';

import { DotsamaWallet, DotsamaWalletBasic, ExtensionEnabler } from './interfaces';
import { supportedExtensions } from './supportedExtensions';

const DISALLOWED_EXTENSIONS: string[] = [];

export const getExtensions = () => {
  const injectedWindow = window as Window & InjectedWindow;
  const knownExtensions: DotsamaWallet<ExtensionEnabler>[] = [];
  const otherExtensions: DotsamaWalletBasic<ExtensionEnabler>[] = [];

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

  return { knownExtensions, otherExtensions };
};
