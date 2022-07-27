import React from 'react';

import { DotsamaWalletsContextProvider } from '../../../src';
import Wallets from './Wallets';

const App = () => (
  <DotsamaWalletsContextProvider>
    <Wallets />
  </DotsamaWalletsContextProvider>
);

export default App;
