import { BaseWallet, BaseWalletProvider } from './types';

export class WalletAggregator {
  walletProviders: Array<BaseWalletProvider>;
  constructor(providers: Array<BaseWalletProvider>) {
    this.walletProviders = providers;
  }
  getWallets(): Array<BaseWallet> {
    let wallets: Array<BaseWallet> = [];
    for (let provider of this.walletProviders) {
      wallets.push(...provider.getWallets());
    }
    return wallets;
  }
}
