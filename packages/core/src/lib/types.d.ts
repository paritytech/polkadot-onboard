import type { Signer } from '@polkadot/api/types';

export type KeypairType = 'ed25519' | 'sr25519' | 'ecdsa' | 'ethereum';

export interface Account {
    address: string;
    type?: KeypairType;
    meta: {
      genesisHash?: string | null;
      name?: string;
      source?: string;
      [propName: string]: unknown;
    };
}

export enum WalletType {
    INJECTED = "INJECTED",
    WC="WALLET_CONNECT",
    LEDGER="LEDGER"
}

export interface BaseWalletProvider {
    getWallets:()=>Array<BaseWallet>;
}

export interface WalletMetadata {
    type: WalletType;
}

export interface BaseWallet {
    metadata:WalletMetadata;
    signer: Signer;
    connect: ()=>void;
    disconnect: ()=>void;
    getAccounts: ()=>Array<Account>;
}