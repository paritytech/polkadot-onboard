import type { BaseWallet, BaseWalletProvider } from './types.js';

export class WalletAggregator {
  walletProviders: BaseWalletProvider[];

  constructor(providers: BaseWalletProvider[]) {
    this.walletProviders = providers;
  }

  async getWallets(): Promise<BaseWallet[]> {
    const wallets: BaseWallet[] = [];

    for (const provider of this.walletProviders) {
      const providedWallets = await provider.getWallets();

      wallets.push(...providedWallets);
    }
    return wallets;
  }
}
