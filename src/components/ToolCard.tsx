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
  variant?: "grid" | "list" | "compact";
}

export default function ToolCard({
  tool,
  showFavoriteButton = true,
  className = "",
  variant = "grid",
}: ToolCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const isFavorited = isFavorite(tool.href);
  const IconComponent = tool.icon;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool.href);
  };

  if (variant === "list") {
    return (
      <Link
        href={tool.available ? tool.href : "#"}
        className={`block ${
          tool.available ? "group" : "cursor-not-allowed"
        } ${className}`}
      >
        <Card
          className={`h-full transition-all shadow-none duration-200 ${
            tool.available ? "hover:shadow-sm cursor-pointer" : "opacity-50"
          }`}
        >
          <CardContent className="px-4 py-2">
            <div className="flex items-center gap-3">
              {showFavoriteButton && tool.available && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-transparent"
                  onClick={handleFavoriteClick}
                  aria-label={
                    isFavorited ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <Heart
                    className={`h-3 w-3 transition-colors ${
                      isFavorited
                        ? "fill-red-500 text-red-500"
                        : "text-muted-foreground hover:text-red-500"
                    }`}
                  />
                </Button>
              )}
              <div className="p-2 rounded-md bg-muted group-hover:bg-primary/10 transition-colors duration-200">
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm truncate">{tool.name}</h3>
                  {!tool.available && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] rounded-xl"
                    >
                      Soon
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {tool.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={tool.available ? tool.href : "#"}
        className={`block ${
          tool.available ? "group" : "cursor-not-allowed"
        } ${className}`}
      >
        <Card
          className={`h-full transition-all rounded-md shadow-none duration-200 relative ${
            tool.available ? "hover:shadow-lg cursor-pointer" : "opacity-50"
          }`}
        >
          {/* Status Badge - Overlapping Top Right Corner */}
          <div className="absolute top-0.5 right-0.5 z-10">
            {!tool.available && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1 py-0 shadow-sm rounded-md"
              >
                Soon
              </Badge>
            )}
          </div>

          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              {/* Icon */}
              <div className="p-1 rounded-md bg-muted group-hover:bg-primary/10 transition-colors duration-200 flex-shrink-0">
                <IconComponent className="w-3 h-3" />
              </div>

              {/* Tool Name */}
              <h3 className="font-medium text-xs leading-tight truncate">
                {tool.name}
              </h3>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

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
