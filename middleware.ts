import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.cookies.get("access_token")?.value) {
    const cloned_req = new Request(request.url, {
      redirect: "manual",
      body: request.body,
      headers: request.headers,
      method: request.method,
    });

    const ogResponse = await fetch(cloned_req);
    if (ogResponse.status !== 401) {
      return ogResponse;
    }
  }
  const email = JSON.parse(
    request.cookies.get("session")?.value || "{}",
  )?.email;
  if (!email) {
    console.log("missing email");
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const resp = await fetch(process.env.BACKEND_URL + "/user/refresh", {
    method: "POST",
    headers: {
      Cookie: request.cookies.toString(),
    },
    body: JSON.stringify({ email: email }),
  });
  if (!resp.ok) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const data = await resp.json();
  request.cookies.set("access_token", data.access_token);
  const response = NextResponse.next();
  if (!response.ok) {
    throw Error("Could not get good response from backend");
  }
  response.cookies.set("access_token", data.access_token);
  return response;
}

export const config = {
  matcher: [
    "/((?!login|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
