import { AppShell } from "@/components/layout/app-shell";
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
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
