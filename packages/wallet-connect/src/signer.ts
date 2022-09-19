import { Signer, SignerResult } from '@polkadot/api/types';
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import { TypeRegistry } from '@polkadot/types';
import SignClient from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';

export class WalletConnectSigner implements Signer {
  registry: TypeRegistry;
  client: SignClient;
  session: SessionTypes.Struct;
  chainId: string;
  id = 0;

  constructor(client: SignClient, session: SessionTypes.Struct, chainId: string) {
    this.client = client;
    this.session = session;
    this.registry = new TypeRegistry();
    this.chainId = chainId;
  }

  // this method is set this way to be bound to this class.
  signPayload = async (payload: SignerPayloadJSON): Promise<SignerResult> => {
    let request = {
      topic: this.session.topic,
      chainId: this.chainId,
      request: {
        id: 1,
        jsonrpc: '2.0',
        method: 'polkadot_signTransaction',
        params: { address: payload.address, transactionPayload: payload },
      },
    };
    let { signature } = await this.client.request(request);
    return { id: ++this.id, signature };
  };

  // this method is set this way to be bound to this class.
  // It might be used outside of the object context to sign messaages.
  // ref: https://polkadot.js.org/docs/extension/cookbook#sign-a-message
  signRaw = async (raw: SignerPayloadRaw): Promise<SignerResult> => {
    let request = {
      topic: this.session.topic,
      chainId: 'polkadot:91b171bb158e2d3848fa23a9f1c25182',
      request: {
        id: 1,
        jsonrpc: '2.0',
        method: 'polkadot_signMessage',
        params: { address: raw.address, message: raw.data },
      },
    };
    let { signature } = await this.client.request(request);
    return { id: ++this.id, signature };
  };
}
