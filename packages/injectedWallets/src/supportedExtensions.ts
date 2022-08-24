import { RawExtension } from './types';

export const supportedExtensions: RawExtension[] = [
  {
    browsers: {
      chrome: 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd',
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/',
    },
    desc: 'Basic account injection and signer',
    name: 'polkadot-js',
  },
  {
    browsers: {
      chrome: 'https://chrome.google.com/webstore/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld',
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/talisman-wallet-extension/',
    },
    desc: 'Talisman is a Polkadot wallet that unlocks a new world of multichain web3 applications in the Paraverse',
    name: 'talisman',
  },
];
