import { FormEvent, memo, useCallback, useEffect, useState } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { BaseWallet, Account } from '@polkadot-onboard/core';

const unitToPlanck = (units: string, decimals: number) => {
  let [whole, decimal] = units.split('.');

  if (typeof decimal === 'undefined') {
    decimal = '';
  }

  return `${whole}${decimal.padEnd(decimals, '0')}`.replace(/^0+/, '');
};

interface SendTransactionData {
  senderAddress: string;
  receiverAddress: string;
}

const Wallet = ({ wallet }: { wallet: BaseWallet }) => {
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [isBusy, setIsBusy] = useState<boolean>(false);

  useEffect(() => {
    const setupApi = async () => {
      const provider = new WsProvider('wss://westend-rpc.polkadot.io');
      const api = await ApiPromise.create({ provider });

      setApi(api);
    };

    setupApi();
  }, []);

  const connect = useCallback(async () => {
    if (!isBusy) {
      setIsBusy(true);
      try {
        await wallet.connect();
        setConnected(true);
      } catch (err) {
        console.error('Failed to connect', err);
      }
      setIsBusy(false);
    }
  }, [wallet]);

  useEffect(() => {
    if (!connected) {
      setAccounts([]);
      return () => {};
    }

    const promUnsubscribe = wallet.subscribeAccounts(setAccounts);

    // unsubscribe to prevent memory leak
    return () => {
      promUnsubscribe.then((unsub) => unsub());
    };
  }, [connected, wallet]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      const form = event.target as HTMLFormElement;
      event.preventDefault();
      event.stopPropagation();

      const data = new FormData(form);
      const { senderAddress, receiverAddress } = Object.fromEntries(data) as unknown as SendTransactionData;

      if (api && wallet?.signer) {
        const amount = unitToPlanck('0.01', api.registry.chainDecimals[0]);

        await api.tx.balances.transfer(receiverAddress, amount).signAndSend(senderAddress, { signer: wallet.signer }, () => {
          // do something with result
        });
      }
    },
    [api, wallet],
  );

  return (
    <div style={{ marginBottom: '20px' }}>
      <button onClick={connect}>{`${wallet.metadata.title} ${wallet.metadata.version || ''}`}</button>
      {accounts.length > 0 &&
        accounts.map(({ address, name = '' }) => (
          <form key={address} onSubmit={handleSubmit} style={{ marginBottom: '10px' }}>
            <div>
              <label>Account name: {name}</label>
            </div>
            <div>
              <label>
                Account address: <input name='senderAddress' type='text' required readOnly value={address} size={60} />
              </label>
            </div>
            <div>
              <label>
                Receiver address: <input name='receiverAddress' type='text' required size={60} />
              </label>
            </div>
            <button type='submit'>Send donation</button>
          </form>
        ))}
    </div>
  );
};

export default memo(Wallet);
