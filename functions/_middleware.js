const ACCESS_KEY = 'rshkr2024portal';

export async function onRequest(context) {
  const url = new URL(context.request.url);

  // robots.txt は常に許可
  if (url.pathname === '/robots.txt') {
    return context.next();
  }

  // URLパラメータにキーがあればCookieをセットして許可
  if (url.searchParams.get('key') === ACCESS_KEY) {
    const res = await context.next();
    const newRes = new Response(res.body, res);
    newRes.headers.set('Set-Cookie', `portal_access=${ACCESS_KEY}; Path=/; Max-Age=86400; SameSite=None; Secure`);
    return newRes;
  }

  // Cookieにキーがあれば許可（サブページ遷移用）
  const cookies = context.request.headers.get('Cookie') || '';
  if (cookies.includes(`portal_access=${ACCESS_KEY}`)) {
    return context.next();
  }

  // それ以外はブロック
  return new Response(
    '<html><body style="font-family:sans-serif;text-align:center;padding:60px;color:#666"><h2>Access Denied</h2><p>このページは社内ポータル経由でのみアクセスできます。</p></body></html>',
    { status: 403, headers: { 'Content-Type': 'text/html;charset=UTF-8' } }
  );
}
