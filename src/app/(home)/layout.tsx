import Header from "@/components/header";
import Footer from "@/components/footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <main className="flex-1">{children}</main>
      <div className="sticky bottom-0 z-50">
        <Footer />
      </div>
    </div>
  );
}
