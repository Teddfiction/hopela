import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/db/middleware";
import { routing } from "@/lib/i18n/routing";

const handleI18nRouting = createIntlMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);
  return updateSession(request, response);
}

export const config = {
  // Skip API routes, Next internals and static files.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
