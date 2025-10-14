// If you use the Pages Router (pages/ directory), use this file instead.
import Head from "next/head";
import AdminConsole from "@/components/AdminConsole";
export default function AdminPage() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <title>GoBag Admin</title>
      </Head>
      <AdminConsole />
    </>
  );
}
