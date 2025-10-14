// If you use the App Router (app/ directory), use this file.
import AdminConsole from "@/components/AdminConsole";
export const metadata = { robots: { index: false, follow: false } };
export default function Page() {
  return <AdminConsole />;
}
