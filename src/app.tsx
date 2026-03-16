import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { SiteShell } from "~/components/site-shell";
import { siteConfig } from "~/lib/config";
import "./app.css";

export default function App() {
  return (
    <MetaProvider>
      <Router
        base={siteConfig.basePath}
        root={(props) => (
          <SiteShell>
            <Suspense>{props.children}</Suspense>
          </SiteShell>
        )}
      >
        <FileRoutes />
      </Router>
    </MetaProvider>
  );
}
