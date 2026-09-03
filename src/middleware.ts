import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // Update Supabase session cookie if active
  await updateSession(request);
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|images|.*\\..*).*)"],
};
