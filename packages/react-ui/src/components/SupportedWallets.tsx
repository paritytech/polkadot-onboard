import { memo } from 'react';
import { ExtensionInfo } from '@dotsama-wallets/react';

const SupportedWallets = ({ extensions }: { extensions: ExtensionInfo[] }) => {
  if (extensions.length === 0) {
    return null;
  }

  return (
    <div>
      <h2>Wallets:</h2>
      {extensions.map(({ name, version, enable }) => (
        <div key={name} style={{ marginBottom: '10px' }}>
          <button onClick={() => enable('dotsama-wallets')}>{`${name} ${version}`}</button>
        </div>
      ))}
    </div>
  );
};

export default memo(SupportedWallets);
