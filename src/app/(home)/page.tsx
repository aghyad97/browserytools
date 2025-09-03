import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tools } from "@/lib/tools-config";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <p className="text-lg text-muted-foreground">
            Essential browser-based tools for productivity. No servers. Full
            privacy.
          </p>
        </div>

        {/* Tools Sections */}
        <div className="space-y-12">
          {tools.map((category) => (
            <div key={category.category}>
              <h2 className="text-2xl font-semibold mb-6 text-left">
                {category.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {category.items.map((tool) => {
                  const IconComponent = tool.icon;
                  return (
                    <Link
                      key={tool.name}
                      href={tool.available ? tool.href : "#"}
                      className={
                        tool.available ? "group" : "cursor-not-allowed"
                      }
                    >
                      <Card
                        className={`h-full transition-all shadow-none duration-200 ${
                          tool.available
                            ? "hover:shadow-md cursor-pointer"
                            : "opacity-50"
                        }`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center mb-2">
                            <div className="p-2 rounded-md bg-muted">
                              <IconComponent className="w-5 h-5" />
                            </div>
                          </div>
                          <CardTitle className="text-base">
                            {tool.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-sm">
                            {tool.description}
                          </CardDescription>
                          {!tool.available && (
                            <div className="mt-3">
                              <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium border border-border text-foreground">
                                Coming Soon
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
