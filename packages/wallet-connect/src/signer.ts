import { Signer, SignerResult } from '@polkadot/api/types';
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import { TypeRegistry } from '@polkadot/types';
import SignClient from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';
export class WalletConnectSigner implements Signer {
  client: SignClient;
  session: SessionTypes.Struct;
  constructor(client: SignClient, session: SessionTypes.Struct) {
    this.client = client;
    this.session = session;
  }
  async signPayload(payload: SignerPayloadJSON): Promise<SignerResult> {
    let registry = new TypeRegistry();
    const raw = registry.createType('ExtrinsicPayload', payload, { version: payload.version });
    let request = {
      topic: this.session.topic,
      chainId: 'eip155:1',
      request: {
        id: 1,
        jsonrpc: '2.0',
        method: 'personal_payload',
        params: [payload.address, raw],
      },
    };
    console.log(raw.toHex());
    console.log('human');
    console.log(raw.toHuman());
    let signature: SignerResult = await this.client.request(request);
    return signature;
  }
  async signRaw(raw: SignerPayloadRaw): Promise<SignerResult> {
    return { id: 0, signature: '0x23' };
  }
}
