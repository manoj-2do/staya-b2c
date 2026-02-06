import { App } from "@/lib/App";
import { getDefinedPaths } from "@/lib/routes";
import { notFound } from "next/navigation";

interface PageProps {
  params: { slug?: string[] };
}

function buildPathFromSlug(slug: string[] | undefined): string {
  if (!slug || slug.length === 0) return "/";
  return "/" + slug.join("/");
}

export default function CatchAllPage({ params }: PageProps) {
  const { slug } = params;
  const path = buildPathFromSlug(slug);
  const definedPaths = getDefinedPaths();

  if (!definedPaths.includes(path)) {
    notFound();
  }

  return <App initialPath={path} />;
}
