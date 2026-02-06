"use client";

import { usePathname } from "next/navigation";
import { getScreenForPath } from "./routes";

interface AppProps {
  initialPath?: string;
}

export function App({ initialPath }: AppProps) {
  const pathname = usePathname();
  const path = (initialPath ?? pathname) || "/";
  const Screen = getScreenForPath(path);

  if (Screen == null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        <p>Page not found</p>
      </div>
    );
  }

  return <Screen />;
}
