import { memo } from 'react';
import { ExtensionInfo } from '../../../injectedWallets/dist';

import Wallet from './Wallet';

const SupportedWallets = ({ extensions }: { extensions: ExtensionInfo[] }) => {
  if (extensions.length === 0) {
    return null;
  }

  return (
    <div>
      <h2>Wallets:</h2>
      {extensions.map((extension) => (
        <Wallet key={extension.name} extension={extension} />
      ))}
    </div>
  );
};

export default memo(SupportedWallets);
