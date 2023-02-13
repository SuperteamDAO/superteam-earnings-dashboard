import Head from "next/head";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Superteam Earning Dashboard</title>
      </Head>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
