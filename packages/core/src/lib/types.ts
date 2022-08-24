import type { Signer } from '@polkadot/api/types';

export type KeypairType = 'ed25519' | 'sr25519';

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
  INJECTED = 'INJECTED',
  WC = 'WALLET_CONNECT',
  LEDGER = 'LEDGER',
}

export interface BaseWalletProvider {
  getWallets: () => Array<BaseWallet>;
}

export interface WalletMetadata {}

export interface BaseWallet {
  metadata: WalletMetadata;
  type: WalletType;
  signer: Signer | null;
  connect: () => void;
  disconnect: () => void;
  getAccounts: () => Array<Account>;
}
