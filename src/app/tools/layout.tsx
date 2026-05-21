import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import NavigationTracker from "@/components/NavigationTracker";
import ToolSeoContent from "@/components/ToolSeoContent";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <NavigationTracker />
      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto py-2">
          {/* The tool itself. Full-viewport tools render at their natural
              height; the SEO content below appears beneath the fold and
              scrolls within this same container. */}
          {children}
          {/* Programmatic on-page SEO content + JSON-LD for every tool. */}
          <ToolSeoContent />
        </main>
      </div>
    </div>
  );
}
