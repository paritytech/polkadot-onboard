import { BaseWallet, BaseWalletProvider } from './types';

export class WalletAggregator {
  walletProviders: BaseWalletProvider[];
  constructor(providers: BaseWalletProvider[]) {
    this.walletProviders = providers;
  }
  getWallets(): BaseWallet[] {
    let wallets: BaseWallet[] = [];
    for (let provider of this.walletProviders) {
      wallets.push(...provider.getWallets());
    }
    return wallets;
  }
}
