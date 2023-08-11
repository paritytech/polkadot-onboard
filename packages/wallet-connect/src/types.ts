import { SignClientTypes } from '@walletconnect/types';

export type WcAccount = `${string}:${string}:${string}`;

export type PolkadotNamespaceChainId = `polkadot:${string}`;

export interface WalletConnectConfiguration extends SignClientTypes.Options {
  // ToDo: Remove ```projectId``` when the following issue is resolved:
  // https://github.com/WalletConnect/walletconnect-monorepo/pull/3435
  projectId: string;
  chainIds?: PolkadotNamespaceChainId[];
  optionalChainIds?: PolkadotNamespaceChainId[];
  onSessionDelete?: () => void;
}
