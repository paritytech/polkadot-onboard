import { memo, useContext } from 'react';
import { DotsamaWalletsContext } from '@dotsama-wallets/react';

import SupportedWallets from './SupportedWallets';

const Wallets = () => {
  const { getExtensions, extensions } = useContext(DotsamaWalletsContext);

  return <>
    <button onClick={getExtensions}>get extensions</button>
    <SupportedWallets extensions={extensions} />
    {/* <OtherWallets extensions={otherExtensions} /> */}
  </>;
};

export default memo(Wallets);
