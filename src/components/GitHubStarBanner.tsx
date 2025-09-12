"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { StarIcon } from "@/components/ui/icons";
import { getRelativeTime, cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";

interface GitHubStats {
  stars: number;
  lastUpdate: string;
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function GitHubStarBanner() {
  const [stats, setStats] = useState<GitHubStats>({
    stars: 0,
    lastUpdate: "",
  });

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const repoResponse = await fetch(
          "https://api.github.com/repos/aghyad97/browserytools"
        );
        const repoData = await repoResponse.json();

        const lastUpdateDate = new Date(repoData.pushed_at);

        setStats({
          stars: repoData.stargazers_count,
          lastUpdate: getRelativeTime(lastUpdateDate),
        });
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      }
    };

    fetchGitHubData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease }}
      className="flex items-center justify-center w-full mb-6"
    >
      <div className="w-full space-y-3">
        <div className="flex flex-wrap justify-center gap-5 w-full">
          <div className={cn("z-10 flex -space-x-12 rtl:space-x-reverse")}>
            <Link
              href="https://github.com/aghyad97/browserytools"
              target="_blank"
              className="h-10 cursor-pointer flex w-auto items-center space-x-1 rounded-full bg-muted px-3 group border-2 border-white dark:border-black/10 whitespace-pre shadow hover:shadow-md"
            >
              <p className="font-medium text-primary text-sm">
                Star Project on GitHub
              </p>
              <div className="flex items-center rounded-full px-2 py-1 text-center font-medium text-sm ">
                <StarIcon />
                <NumberFlow
                  value={stats.stars}
                  className={cn("tabular-nums", "ml-1")}
                  transformTiming={{
                    duration: 1000,
                    easing: "ease-out",
                  }}
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
