import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // 1. Identify if it's the cms subdomain
  // Change "wavy-energy.vercel.app" or "wavy.com" to your actual domain
  const isDevelopment = process.env.NODE_ENV === 'development';
  const adminSubdomain = isDevelopment 
    ? hostname.startsWith('cms.localhost') 
    : hostname.startsWith('cms.');

  if (adminSubdomain) {
    // Rewrite internal URL to the /cms folder
    // For example: cms.localhost:3000/dashboard -> localhost:3000/admin/dashboard
    const newPath = `/cms${url.pathname}`;
    return NextResponse.rewrite(new URL(newPath, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};
