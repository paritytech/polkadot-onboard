import { memo } from 'react';
import { useWallets } from '@dotsama-wallets/react';
import { BaseWallet } from '@dotsama-wallets/core';
import Wallet from './Wallet';

const Wallets = () => {
  const { wallets } = useWallets();

  return (
    <div>
      {wallets.map((wallet: BaseWallet) => (
        <Wallet key={wallet.metadata.title} wallet={wallet} />
      ))}
    </div>
  );
};

export default memo(Wallets);
