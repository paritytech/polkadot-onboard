import { Injected, InjectedWindow, InjectedAccount } from '@polkadot/extension-inject/types';
import { Account, BaseWallet, BaseWalletProvider, WalletMetadata, WalletType } from '@dotsama-wallets/core';
import { extensionConfig } from './supportedExtensions';
import { Signer } from '@polkadot/api/types';
import { ExtensionConfiguration, WalletExtension } from './types';

const toWalletAccount = (account: InjectedAccount) => {
  return account as Account;
};

class InjectedWallet implements BaseWallet {
  type = WalletType.INJECTED;
  extension: WalletExtension | undefined;
  injected: Injected | undefined;
  metadata: WalletMetadata;
  signer: Signer | undefined;
  constructor(extension: WalletExtension) {
    this.extension = extension;
    this.metadata = { ...extension.metadata };
  }
  async getAccounts(): Promise<Account[]> {
    let injectedAccounts = await this.injected?.accounts.get();
    let walletAccounts = injectedAccounts?.map((account) => toWalletAccount(account));
    return walletAccounts || [];
  }
  connect() {}
  disconnect() {}
  isConnected() {
    return false;
  }
}

export class InjectedWalletProvider implements BaseWalletProvider {
  config: ExtensionConfiguration;
  constructor(config: ExtensionConfiguration) {
    this.config = config;
  }
  getExtensions(): { known: WalletExtension[]; other: WalletExtension[] } {
    const injectedWindow = window as Window & InjectedWindow;
    const knownExtensions: WalletExtension[] = [];
    const otherExtensions: WalletExtension[] = [];

    Object.keys(injectedWindow.injectedWeb3).forEach((extensionId) => {
      if (!this.config.disallowed.includes(extensionId)) {
        const foundExtension = this.config.supported.find(({ id }) => id === extensionId);
        if (foundExtension) {
          knownExtensions.push({ ...injectedWindow.injectedWeb3[extensionId], metadata: foundExtension });
        } else {
          otherExtensions.push({ ...injectedWindow.injectedWeb3[extensionId], metadata: { id: extensionId, title: extensionId } });
        }
      }
    });

    return { known: knownExtensions, other: otherExtensions };
  }

  getWallets(): BaseWallet[] {
    let injectedWallets = [];
    let { known, other } = this.getExtensions();
    let extensions = [...known, ...other];
    injectedWallets = extensions.map((ext) => new InjectedWallet(ext));
    return injectedWallets;
  }
}
