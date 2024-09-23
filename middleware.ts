import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh_token");
  if (!refreshToken?.value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (accessToken) {
    const resp = await fetch(process.env.BACKEND_URL + "/user/authenticated", {
      method: "GET",
      headers: {
        Cookie: request.cookies.toString(),
      },
    });
    if (resp.ok) {
      console.log("user is authenticated");
      return NextResponse.next();
    }
  }
  const email = JSON.parse(
    request.cookies.get("session")?.value || "{}",
  )?.email;
  if (!email) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const resp = await fetch(process.env.BACKEND_URL + "/user/refresh", {
    method: "POST",
    headers: {
      Cookie: request.cookies.toString(),
    },
    body: JSON.stringify({ refresh_token: refreshToken.value, email: email }),
  });
  if (!resp.ok) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const data = await resp.json();
  console.log(data.access_token);
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
