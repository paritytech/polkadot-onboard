import type { Account, BaseWallet, BaseWalletProvider, WalletMetadata } from '@polkadot-onboard/core';
import type { Signer } from '@polkadot/types/types';
import type { SessionTypes } from '@walletconnect/types';
import type { PolkadotNamespaceChainId, WalletConnectConfiguration, WcAccount } from './types.js';

import { WalletType } from '@polkadot-onboard/core';
import SignClient from '@walletconnect/sign-client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { WalletConnectSigner } from './signer.js';

export const POLKADOT_CHAIN_ID = 'polkadot:91b171bb158e2d3848fa23a9f1c25182';
export const WC_VERSION = '2.0';

const toWalletAccount = (wcAccount: WcAccount) => {
  let address = wcAccount.split(':')[2];
  return { address };
};

class WalletConnectWallet implements BaseWallet {
  type = WalletType.WALLET_CONNECT;
  appName: string;
  metadata: WalletMetadata;
  config: WalletConnectConfiguration;
  client: SignClient | undefined;
  signer: Signer | undefined;
  session: SessionTypes.Struct | undefined;
  chainId: PolkadotNamespaceChainId;

  constructor(config: WalletConnectConfiguration, appName: string, chainId?: PolkadotNamespaceChainId) {
    this.config = config;
    this.appName = appName;
    this.metadata = {
      id: 'wallet-connect',
      title: config.metadata?.name || 'Wallet Connect',
      description: config.metadata?.description || '',
      urls: { main: config.metadata?.url || '' },
      iconUrl: config.metadata?.icons[0] || '',
      version: WC_VERSION,
    };
    this.chainId = chainId || POLKADOT_CHAIN_ID;
  }

  reset(): void {
    this.client = undefined;
    this.session = undefined;
    this.signer = undefined;
  }

  async getAccounts(): Promise<Account[]> {
    let accounts: Account[] = [];
    if (this.session) {
      let wcAccounts = Object.values(this.session.namespaces)
        .map((namespace) => namespace.accounts)
        .flat();
      accounts = wcAccounts.map((wcAccount) => toWalletAccount(wcAccount as WcAccount));
    }
    return accounts;
  }

  async connect() {
    // reset the client
    this.reset();

    // init the client
    let client = await SignClient.init(this.config);
    let params = {
      requiredNamespaces: {
        polkadot: {
          methods: ['polkadot_signTransaction', 'polkadot_signMessage'],
          chains: [this.chainId],
          events: [],
        },
      },
    };

    const { uri, approval } = await client.connect(params);
    return new Promise<void>((resolve, reject) => {
      // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
      if (uri) {
        QRCodeModal.open(uri, () => {
          reject(new Error('Canceled pairing. QR Code Modal closed.'));
        });
      }
      // Await session approval from the wallet.
      approval()
        .then((session) => {
          // setup the client
          this.client = client;
          this.session = session;
          this.signer = new WalletConnectSigner(client, session, this.chainId);
          resolve();
        })
        .catch(reject)
        .finally(() => QRCodeModal.close());
    });
  }

  async disconnect() {
    if (this.session?.topic) {
      this.client?.disconnect({
        topic: this.session?.topic,
        reason: {
          code: -1,
          message: 'Disconnected by client!',
        },
      });
    }
    this.reset();
  }

  isConnected() {
    return !!(this.client && this.signer && this.session);
  }
}

export class WalletConnectProvider implements BaseWalletProvider {
  config: WalletConnectConfiguration;
  appName: string;

  constructor(config: WalletConnectConfiguration, appName: string) {
    this.config = config;
    this.appName = appName;
  }

  getWallets(): BaseWallet[] {
    return [new WalletConnectWallet(this.config, this.appName)];
  }
}
