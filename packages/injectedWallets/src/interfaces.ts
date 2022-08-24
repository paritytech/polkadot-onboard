import { WalletMetadata } from '@dotsama-wallets/core';
import { Injected } from '@polkadot/extension-inject/types';

export interface Browsers {
  chrome: string;
  firefox: string;
}

export type ExtensionEnabler = (origin: string) => Promise<Injected>;

export interface WalletExtension<T> {
  enable: T;
  version: string;
  // isConnected: boolean;
  name: string;
}

export interface InjectedWalletMetadata extends WalletMetadata {
  browsers: Browsers;
  desc: string;
  name: string;
}
