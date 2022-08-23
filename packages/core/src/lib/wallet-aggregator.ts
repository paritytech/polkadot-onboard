import { BaseWalletProvider } from "./types";

export class WalletAggregator {
    walletProviders:Array<BaseWalletProvider>;
    constructor(providers:Array<BaseWalletProvider>){
        this.walletProviders = providers
    }
}