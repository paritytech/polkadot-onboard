import { Account, BaseWallet, BaseWalletProvider, WalletMetadata, WalletType } from '@dotsama-wallets/core';
import { Signer } from '@polkadot/api/types';
import SignClient from '@walletconnect/sign-client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { SessionTypes } from '@walletconnect/types';
import { WalletConnectSigner } from './signer';
import { WalletConnectConfiguration, WcAccount } from './types';

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
  constructor(config: WalletConnectConfiguration, appName: string) {
    this.config = config;
    this.appName = appName;
    this.metadata = {
      title: 'Wallet Connect' || '',
      description: config.metadata?.description || '',
      urls: { main: config.metadata?.url || '' },
      iconUrl: config.metadata?.icons[0] || '',
      version: '2.0',
    };
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
    try {
      // reset the client
      this.reset();

      // init the client
      let client = await SignClient.init(this.config);

      const { uri, approval } = await client.connect({
        requiredNamespaces: {
          polkadot: {
            methods: ['polkadot_signTransaction', 'polkadot_signMessage'],
            chains: ['polkadot:91b171bb158e2d3848fa23a9f1c25182'],
            events: [],
          },
        },
      });

      // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
      if (uri) {
        QRCodeModal.open(uri, () => {
          console.log('EVENT', 'QR Code Modal closed');
        });
      }

      // Await session approval from the wallet.
      let session = await approval();
      // setup the client
      this.client = client;
      this.session = session;
      this.signer = new WalletConnectSigner(client, session);
      console.log(this.session);
    } catch (e) {
      console.error(e);
    } finally {
      // Close the QRCode modal in case it was open.
      QRCodeModal.close();
    }
  }
  async disconnect() {}
  isConnected() {
    return false;
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
