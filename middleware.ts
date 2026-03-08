import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // 1. Identify if it's the admin subdomain
  // Change "wavy-energy.vercel.app" or "wavy.com" to your actual domain
  const isDevelopment = process.env.NODE_ENV === 'development';
  const adminSubdomain = isDevelopment 
    ? hostname.startsWith('admin.localhost') 
    : hostname.startsWith('admin.');

  if (adminSubdomain) {
    // Rewrite internal URL to the /admin folder
    // For example: admin.localhost:3000/dashboard -> localhost:3000/admin/dashboard
    const newPath = `/admin${url.pathname}`;
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
