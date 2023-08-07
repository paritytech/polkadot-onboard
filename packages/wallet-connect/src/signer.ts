import { TypeRegistry } from '@polkadot/types';
import type { Signer, SignerResult } from '@polkadot/types/types';
import type { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import type { HexString } from '@polkadot/util/types';
import SignClient from '@walletconnect/sign-client';
import type { SessionTypes } from '@walletconnect/types';

import { POLKADOT_CHAIN_ID } from './wallet-connect.js';

interface Signature {
  signature: HexString;
}

export class WalletConnectSigner implements Signer {
  registry: TypeRegistry;
  client: SignClient;
  session: SessionTypes.Struct;
  id = 0;

  constructor(client: SignClient, session: SessionTypes.Struct) {
    this.client = client;
    this.session = session;
    this.registry = new TypeRegistry();
  }

  signPayload = async (payload: SignerPayloadJSON): Promise<SignerResult> => {
    const request = {
      topic: this.session.topic,
      chainId: `polkadot:${payload.genesisHash.replace('0x', '').substring(0, 32)}`,
      request: {
        id: 1,
        jsonrpc: '2.0',
        method: 'polkadot_signTransaction',
        params: { address: payload.address, transactionPayload: payload },
      },
    };

    const { signature } = await this.client.request<Signature>(request);

    return { id: ++this.id, signature };
  };

  signRaw = async (raw: SignerPayloadRaw): Promise<SignerResult> => {
    const request = {
      topic: this.session.topic,
      chainId: POLKADOT_CHAIN_ID,
      request: {
        id: 1,
        jsonrpc: '2.0',
        method: 'polkadot_signMessage',
        params: { address: raw.address, message: raw.data },
      },
    };

    const { signature } = await this.client.request<Signature>(request);

    return { id: ++this.id, signature };
  };
}
