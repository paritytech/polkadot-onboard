import type { Injected, InjectedWindow, InjectedAccount } from '@polkadot/extension-inject/types';
import type { Signer } from '@polkadot/types/types';
import { Account, BaseWallet, BaseWalletProvider, WalletMetadata, WalletType } from '@polkadot-onboard/core';
import type { ExtensionConfiguration, WalletExtension } from './types';

const toWalletAccount = (account: InjectedAccount) => {
  return account as Account;
};

class InjectedWallet implements BaseWallet {
  type = WalletType.INJECTED;
  extension: WalletExtension;
  appName: string;
  injected: Injected | undefined;
  metadata: WalletMetadata;
  signer: Signer | undefined;
  constructor(extension: WalletExtension, appName: string) {
    this.extension = extension;
    this.metadata = { ...extension.metadata };
    this.appName = appName;
  }
  async getAccounts(): Promise<Account[]> {
    let injectedAccounts = await this.injected?.accounts.get();
    let walletAccounts = injectedAccounts?.map((account) => toWalletAccount(account));
    return walletAccounts || [];
  }
  async connect() {
    try {
      let injected: Injected | undefined;
      if (this.extension?.connect) {
        injected = await this.extension.connect(this.appName);
      } else if (this.extension?.enable) {
        injected = await this.extension.enable(this.appName);
      } else {
        throw new Error('No connect(..) or enable(...) hook found');
      }

      this.injected = injected;
      this.signer = injected.signer;
    } catch ({ message }) {
      console.error(`Error initializing ${this.metadata.title}: ${message}`);
    }
  }
  async disconnect() {}
  isConnected() {
    return false;
  }
}

export class InjectedWalletProvider implements BaseWalletProvider {
  config: ExtensionConfiguration;
  supportedOnly: boolean;
  appName: string;
  constructor(config: ExtensionConfiguration, appName: string, supportedOnly: boolean = false) {
    this.config = config;
    this.supportedOnly = supportedOnly;
    this.appName = appName;
  }
  getExtensions(): { known: WalletExtension[]; other: WalletExtension[] } {
    const injectedWindow = window as Window & InjectedWindow;
    const knownExtensions: WalletExtension[] = [];
    const otherExtensions: WalletExtension[] = [];
    if (injectedWindow.injectedWeb3) {
      Object.keys(injectedWindow.injectedWeb3).forEach((extensionId) => {
        if (!this.config.disallowed?.includes(extensionId)) {
          const foundExtension = this.config.supported?.find(({ id }) => id === extensionId);
          if (foundExtension) {
            knownExtensions.push({ ...injectedWindow.injectedWeb3[extensionId], metadata: foundExtension });
          } else {
            otherExtensions.push({ ...injectedWindow.injectedWeb3[extensionId], metadata: { id: extensionId, title: extensionId } });
          }
        }
      });
    } else {
      console.info('no extension was detected!');
    }

    return { known: knownExtensions, other: otherExtensions };
  }

  getWallets(): BaseWallet[] {
    let injectedWallets: InjectedWallet[] = [];
    let { known, other } = this.getExtensions();
    let extensions = [...known];
    if (!this.supportedOnly) {
      extensions = [...extensions, ...other];
    }
    injectedWallets = extensions.map((ext) => new InjectedWallet(ext, this.appName));
    return injectedWallets;
  }
}
