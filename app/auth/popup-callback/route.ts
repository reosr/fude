
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  let success = false;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    success = !error;
  }

  const origin = url.origin;
  const message = success
    ? "fude-google-auth-success"
    : "fude-google-auth-error";

  const fallback = success
    ? `${origin}/profil?auth=success`
    : `${origin}/?auth_error=google`;

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Login Fude</title>
</head>
<body>
  <p>Login selesai. Jendela ini akan ditutup...</p>
  <script>
    (() => {
      const targetOrigin = ${JSON.stringify(origin)};
      const message = ${JSON.stringify(message)};

      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: message }, targetOrigin);
        window.setTimeout(() => window.close(), 150);
      } else {
        window.location.replace(${JSON.stringify(fallback)});
      }
    })();
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
