const ACCESS_KEY = 'rshkr2024portal';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const headers = context.request.headers;

  // robots.txt は常に許可
  if (url.pathname === '/robots.txt') {
    return context.next();
  }

  // 許可条件:
  // 1. ?key= パラメータが正しい（直接アクセス用）
  // 2. iframe経由のリクエスト（Sec-Fetch-Dest: iframe）
  const hasKey = url.searchParams.get('key') === ACCESS_KEY;
  const isIframe = headers.get('Sec-Fetch-Dest') === 'iframe';

  if (hasKey || isIframe) {
    const res = await context.next();
    const newRes = new Response(res.body, res);
    // Google Sitesからのiframe埋め込みのみ許可
    newRes.headers.set('Content-Security-Policy', "frame-ancestors 'self' https://sites.google.com https://*.google.com");
    return newRes;
  }

  // それ以外はブロック
  return new Response(
    '<html><body style="font-family:sans-serif;text-align:center;padding:60px;color:#666"><h2>Access Denied</h2><p>このページは社内ポータル経由でのみアクセスできます。</p></body></html>',
    { status: 403, headers: { 'Content-Type': 'text/html;charset=UTF-8' } }
  );
}
