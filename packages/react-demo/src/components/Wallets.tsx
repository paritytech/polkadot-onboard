import { memo } from 'react';
import { useWallets } from '@polkadot-wallets/react';
import { BaseWallet } from '@polkadot-wallets/core';
import Wallet from './Wallet';

const Wallets = () => {
  const { wallets } = useWallets();

  return (
    <div>
      <h2>Wallets:</h2>
      {wallets.map((wallet: BaseWallet) => (
        <Wallet key={wallet.metadata.title} wallet={wallet} />
      ))}
    </div>
  );
};

export default memo(Wallets);
