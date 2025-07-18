import Head from "next/head";

export default function MetaTags() {
  return (
    <Head>
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      <link rel="apple-touch-startup-image" href="/splash.png" />
    </Head>
  );
}
