import { InjectedWindow } from '@polkadot/extension-inject/types';
import { Account, BaseWallet, WalletType } from '@dotsama-wallets/core';
import  ExtensionEnabler, WalletExtension } from './interfaces';
import { supportedExtensions } from './supportedExtensions';
import { Signer } from '@polkadot/api/types';
import { InjectedWalletMetadata, WalletExtension } from './interfaces';

const DISALLOWED_EXTENSIONS: string[] = [];

class InjectedWallet implements BaseWallet {
  type: WalletType.INJECTED;
  metadata: InjectedWalletMetadata|{};
  signer: Signer|null = null;
  getAccounts(): Array<Account> {}
}

const getExtensions = () => {
  const injectedWindow = window as Window & InjectedWindow;
  const knownExtensions: WalletExtension<ExtensionEnabler>[] = [];
  const otherExtensions: WalletExtension<ExtensionEnabler>[] = [];

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
