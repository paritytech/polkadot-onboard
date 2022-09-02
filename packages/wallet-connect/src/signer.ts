import { Signer, SignerResult } from '@polkadot/api/types';
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import { TypeRegistry } from '@polkadot/types';
import SignClient from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';
import { u8aToHex } from '@polkadot/util';
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
    const hex = u8aToHex(raw.toU8a({ method: true }));
    let request = {
      topic: this.session.topic,
      chainId: 'polkadot:91b171bb158e2d3848fa23a9f1c25182',
      request: {
        id: 1,
        jsonrpc: '2.0',
        method: 'polkadot_signTransaction',
        params: [payload.address, hex],
      },
    };
    let signature: SignerResult = await this.client.request(request);
    console.log(raw.toHuman());
    console.log(hex);
    console.log(raw.toHex());
    console.log(signature);
    return signature;
  }
  async signRaw(raw: SignerPayloadRaw): Promise<SignerResult> {
    return { id: 0, signature: '0x23' };
  }
}

/*
Sample payload

{
  "method": "0x0400000af020e461607041e123f2a2e8944ba4ec5e2f6acdf9335dbb4c09fa8bdbfc4c0700e40b5402",
  "era": {
      "MortalEra": {
          "period": "64",
          "phase": "36"
      }
  },
  "nonce": "0",
  "tip": "0",
  "specVersion": "9,280",
  "genesisHash": "0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e",
  "blockHash": "0xc3531d522947f3550a97c8d926d2927a9f91741f6328bff214d9467befa73bd7"
}
*/
