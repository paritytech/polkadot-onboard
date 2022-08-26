import { memo, useCallback, useEffect, useState } from 'react';
import { utils } from 'ethers';
// TODO discuss about Api, potentially can be moved higher up, maybe even to core
import { ApiPromise, WsProvider } from '@polkadot/api';
import { BaseWallet, Account } from '@dotsama-wallets/core';

const Wallet = ({ wallet }: { wallet: BaseWallet }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [api, setApi] = useState<ApiPromise | null>(null);

  useEffect(() => {
    const setupApi = async () => {
      const provider = new WsProvider('wss://westend-rpc.polkadot.io');
      const api = await ApiPromise.create({ provider });

      setApi(api);
    };

    setupApi();
  }, []);

  const getAccounts = async () => {
    // TODO prevent multi-click, add try catch
    await wallet.connect();
    let accounts = await wallet.getAccounts();
    setAccounts(accounts);
  };

  const sendTransaction = useCallback(
    async (senderAddress: string) => {
      if (api && wallet?.signer) {
        const decimals = api.registry.chainDecimals[0];
        const amountBN = utils.parseUnits('0.01', decimals);

        await api.tx.balances
          .transfer('5CK3fkziX4aEJTfbnwUek53obhpKi56CsNC19PfTNqrQ6EWz', amountBN.toString())
          .signAndSend(senderAddress, { signer: wallet.signer }, () => {
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
          <div key={address} style={{ marginBottom: '10px' }}>
            <div>Account name: {name}</div>
            <div>Account address: {address}</div>
            <button onClick={() => sendTransaction(address)}>Send donation</button>
          </div>
        ))}
    </div>
  );
};

export default memo(Wallet);
