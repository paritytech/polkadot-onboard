import React, { memo, useContext } from 'react';

import { DotsamaWalletsContext } from '../../../src';
import SupportedWallets from './SupportedWallets';

const Wallets = () => {
  const { getExtensions, extensions, otherExtensions } = useContext(DotsamaWalletsContext);

  return <>
    <button onClick={getExtensions}>get extensions</button>
    <SupportedWallets extensions={extensions} />
    {/* <OtherWallets extensions={otherExtensions} /> */}
  </>;
};

export default memo(Wallets);
