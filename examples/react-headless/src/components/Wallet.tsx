import { FormEvent, memo, useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { BaseWallet, Account } from '@polkadot-onboard/core';

interface SendTransactionData {
  senderAddress: string;
  receiverAddress: string;
}

const Wallet = ({ wallet }: { wallet: BaseWallet }) => {
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

  const getAccounts = async () => {
    if (!isBusy) {
      try {
        setIsBusy(true);
        await wallet.connect();
        let accounts = await wallet.getAccounts();
        setAccounts(accounts);
      } catch (error) {
        // handle error
      } finally {
        setIsBusy(false);
      }
    }
  };

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      const form = event.target as HTMLFormElement;
      event.preventDefault();
      event.stopPropagation();

      const data = new FormData(form);
      const { senderAddress, receiverAddress } = Object.fromEntries(data) as unknown as SendTransactionData;

      if (api && wallet?.signer) {
        const decimals = api.registry.chainDecimals[0];
        const amountBN = ethers.parseUnits('0.01', decimals);

        await api.tx.balances.transfer(receiverAddress, amountBN.toString()).signAndSend(senderAddress, { signer: wallet.signer }, () => {
          // do something with result
        });
      }
    },
    [api, wallet],
  );

  return (
    <div style={{ marginBottom: '20px' }}>
      <button onClick={getAccounts}>{`${wallet.metadata.title} ${wallet.metadata.version || ''}`}</button>
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
