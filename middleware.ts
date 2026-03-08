import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  const isDevelopment = process.env.NODE_ENV === 'development';
  const isCmsSubdomain = isDevelopment 
    ? hostname.startsWith('cms.localhost') 
    : hostname.startsWith('cms.');

  // 1. If on the CMS subdomain, rewrite root to /cms
  if (isCmsSubdomain) {
    // Prevent infinite loop if internal path already starts with /cms
    if (url.pathname.startsWith('/cms')) {
       return NextResponse.next();
    }
    const newPath = `/cms${url.pathname}`;
    return NextResponse.rewrite(new URL(newPath, req.url));
  }

  // 2. If on the main domain but trying to access /cms directly, redirect to home
  // This prevents https://wavy-energy.vercel.app/cms from working
  if (!isCmsSubdomain && url.pathname.startsWith('/cms')) {
    return NextResponse.redirect(new URL('/', req.url));
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
