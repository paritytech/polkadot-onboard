import type { Signer } from '@polkadot/api/types';

export type KeypairType = 'ed25519' | 'sr25519';

export interface Account {
  address: string;
  type?: KeypairType;
  genesisHash?: string | null;
  name?: string;
}

export enum WalletType {
  INJECTED = 'INJECTED',
  WC = 'WALLET_CONNECT',
  LEDGER = 'LEDGER',
}

export interface BaseWalletProvider {
  getWallets: () => BaseWallet[];
}

export interface WalletMetadata {
  title: string;
  description?: string;
  urls?: { main?: string; browsers?: Record<string, string> };
  iconUrl?: string;
}

export interface BaseWallet {
  metadata: WalletMetadata;
  type: WalletType;
  // signer will be available when the wallet is connected, otherwise it is undefined
  signer: Signer | undefined;
  connect: () => void;
  disconnect: () => void;
  isConnected: () => boolean;
  getAccounts: () => Promise<Account[]>;
}
