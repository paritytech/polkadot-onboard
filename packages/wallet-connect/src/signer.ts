import { Signer, SignerResult } from '@polkadot/api/types';
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import SignClient from '@walletconnect/sign-client';

export class WalletConnectSigner implements Signer {
  client: SignClient;
  constructor(client: SignClient) {
    this.client = client;
  }
  async signPayload(payload: SignerPayloadJSON): Promise<SignerResult> {
    return { id: 0, signature: '0x23' };
  }
  async signRaw(raw: SignerPayloadRaw): Promise<SignerResult> {
    return { id: 0, signature: '0x23' };
  }
}
