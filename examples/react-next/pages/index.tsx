import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import ConnectContainer from 'components/ConnectContainer';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Substrate Wallet Aggregator</title>
        <meta name='description' content='A wallet aggregator to select accounts from your different wallets' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Substrate Wallets</h1>
        <p className={styles.description}>Get started by connecting to your favorite wallets</p>
        <ConnectContainer />
      </main>
    </div>
  );
};

export default Home;
