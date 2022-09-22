# polkadot-wallets

_@polkadot-wallets_ provides a set of packages for developers to easily onboard and add different type of polkadot wallets to their dapps. It provides a universal interface for working with different type of wallets (e.g. Injected-wallets, Wallet-Connect, hardware-wallets).

## install the packages:

```ts
// yarn
yarn add \
 @polkadot-wallets/core\
 @polkadot-wallets/injected-wallets\
 @polkadot-wallets/wallet-connect\
 @polkadot-wallets/react
```

## example for using it in a react-app:

```ts
import { WalletAggregator } from '@polkadot-wallets/core';
import { InjectedWalletProvider } from '@polkadot-wallets/injected-wallets';
import { WalletConnectProvider } from '@polkadot-wallets/wallet-connect';
import { PolkadotWalletsContextProvider, useWallets } from '@polkadot-wallets/react';

const APP_NAME = 'Polkadot wallets example';

const ConnectContainer = () => {
    let walletConnectParams = {
        projectId: '4fae...',
        relayUrl: 'wss://relay.walletconnect.com',
        metadata: {
        name: 'Polkadot Demo',
        description: 'Polkadot Demo',
        url: '#',
        icons: ['https://walletconnect.com/walletconnect-logo.png'],
        },
    };
    let walletAggregator = new WalletAggregator([
            new InjectedWalletProvider({}, 'wallets example'),
            new WalletConnectProvider(walletConnectParams, 'wallets example')
    ]);
    return (
        <PolkadotWalletsContextProvider walletAggregator={walletAggregator}>
        /*
        all wallets are available in this context to all subcomponents.

        const { wallets } = useWallets();

        each wallet provides a universal interface inclusing a signer which can be used to sign messages and transactions:

        interface BaseWallet {
            ...
            signer: Signer | undefined;
            connect: () => Promise<void>;
            disconnect: () => Promise<void>;
            isConnected: () => boolean;
            getAccounts: () => Promise<Account[]>;
            ...
        }
        */
        </PolkadotWalletsContextProvider>
    );
```

check the full examples:

- [headless](packages/react-demo/)
- [react-next](examples/react-dapp)
