import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import Footer from "@/components/layout/footer";
import s from "@/components/layout/app-shell.module.css";

/**
 * Same chrome as the home and tool routes. The hub page itself is a server
 * component, so its prose is in the initial HTML regardless of what the rail
 * and top bar do on the client.
 */
export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppShell />
      <div className={s.content}>
        <TopBar />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
