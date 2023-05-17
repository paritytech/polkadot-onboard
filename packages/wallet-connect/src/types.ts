import { SignClientTypes } from '@walletconnect/types';

export type WcAccount = `${string}:${string}:${string}`;
export type PolkadotNamespaceChainId = `polkadot:${string}`;
export interface WalletConnectConfiguration extends SignClientTypes.Options {}
