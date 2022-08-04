import { InjectedWindowProvider } from '@polkadot/extension-inject/types';

export interface Browsers {
  chrome: string;
  firefox: string;
}

export interface RawExtension {
  browsers: Browsers;
  desc: string;
  name: string;
}

export interface BasicExtensionInfo extends InjectedWindowProvider {
  name: string;
}

export interface ExtensionInfo extends InjectedWindowProvider, RawExtension {}
