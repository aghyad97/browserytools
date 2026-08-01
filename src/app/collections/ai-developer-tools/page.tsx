import type { Metadata } from "next";

import { ClusterHub } from "@/components/clusters/cluster-hub";
import { buildClusterMetadata } from "@/lib/cluster-metadata";

const CLUSTER_ID = "ai-developer-tools" as const;

export async function generateMetadata(): Promise<Metadata> {
  return buildClusterMetadata(CLUSTER_ID);
}

export default function Page() {
  return <ClusterHub id={CLUSTER_ID} />;
}
