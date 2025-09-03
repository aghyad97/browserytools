"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tool } from "@/lib/tools-config";
import { useFavoritesStore } from "@/store/favorites-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolCardProps {
  tool: Tool & { category: string };
  showFavoriteButton?: boolean;
  className?: string;
}

export default function ToolCard({
  tool,
  showFavoriteButton = true,
  className = "",
}: ToolCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const isFavorited = isFavorite(tool.href);
  const IconComponent = tool.icon;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool.href);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={tool.available ? tool.href : "#"}
            className={`block ${
              tool.available ? "group" : "cursor-not-allowed"
            } ${className}`}
          >
            <Card
              className={`h-full transition-all shadow-none duration-200 relative ${
                tool.available ? "hover:shadow-sm cursor-pointer" : "opacity-50"
              }`}
            >
              {/* Status Badge - Overlapping Top Right Corner */}
              <div className="absolute top-0.5 right-1 z-10">
                {tool.available ? (
                  <div></div>
                ) : (
                  <Badge
                    variant="secondary"
                    className="text-xs shadow-sm rounded-xl"
                  >
                    Soon
                  </Badge>
                )}
              </div>

              {/* Favorite Button - Top Left Corner */}
              {showFavoriteButton && tool.available && (
                <div className="absolute top-0.5 left-1 z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-transparent"
                    onClick={handleFavoriteClick}
                  >
                    <Heart
                      className={`h-3 w-3 transition-colors ${
                        isFavorited
                          ? "fill-red-500 text-red-500"
                          : "text-muted-foreground hover:text-red-500"
                      }`}
                    />
                  </Button>
                </div>
              )}

              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Icon */}
                  <div className="p-3 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors duration-200">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Tool Name */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm leading-tight">
                      {tool.name}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-sm">{tool.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
