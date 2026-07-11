import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import Footer from "@/components/layout/footer";
import s from "@/components/layout/app-shell.module.css";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
