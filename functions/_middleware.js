export async function onRequest(context) {
  const referer = context.request.headers.get('Referer') || '';
  const url = new URL(context.request.url);

  // robots.txt は常に許可（検索エンジンがブロック指示を読めるように）
  if (url.pathname === '/robots.txt') {
    return context.next();
  }

  // 許可するリファラー
  const allowed = [
    'sites.google.com',
    'rashikuru-information.pages.dev'
  ];

  const isAllowed = allowed.some(domain => referer.includes(domain));

  if (isAllowed) {
    return context.next();
  }

  // リファラーなし or 許可外 → ブロック
  return new Response(
    '<html><body style="font-family:sans-serif;text-align:center;padding:60px;color:#666"><h2>Access Denied</h2><p>このページは社内ポータル経由でのみアクセスできます。</p></body></html>',
    { status: 403, headers: { 'Content-Type': 'text/html;charset=UTF-8' } }
  );
}
