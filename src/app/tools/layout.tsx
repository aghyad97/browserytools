import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto py-2">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
