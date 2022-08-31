import { Account, BaseWallet, BaseWalletProvider, WalletMetadata, WalletType } from '@dotsama-wallets/core';
import { Signer } from '@polkadot/api/types';
import SignClient from '@walletconnect/sign-client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { WalletConnectConfiguration } from './types';

class WalletConnectWallet implements BaseWallet {
  type = WalletType.WALLET_CONNECT;
  appName: string;
  metadata: WalletMetadata;
  config: WalletConnectConfiguration;
  client: SignClient | undefined;
  signer: Signer | undefined;
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
  async getAccounts(): Promise<Account[]> {
    return [];
  }
  async connect() {
    try {
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
      const session = await approval();
      // Handle the returned session (e.g. update UI to "connected" state).
      // await onSessionConnected(session);
      console.log(session);
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
