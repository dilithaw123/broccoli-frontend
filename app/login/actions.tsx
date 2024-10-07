import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type response = {
  user: {
    id: number;
    name: string;
    email: string;
  }
  access_token: string;
  refresh_token: string;
}


export async function handleSubmit(formData: FormData) {
  'use server';
  const displayName = formData.get("displayName") as string;
  const email = formData.get("email") as string;
  const data = { name: displayName, email: email };
  if (!process.env.API_KEY) {
    return;
  }
  const response = await fetch(`${process.env.BACKEND_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": process.env.API_KEY,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    switch (response.status) {
      case 400:
        throw new Error("Invalid form data");
      default:
        throw new Error("Internal server error");
    }
  }
  const json: response = await response.json();
  cookies().set("session", JSON.stringify(json.user), {
    httpOnly: true,
    sameSite: "strict",
    expires: Date.now() * (1000 * 3600 * 24 * 30)
  });
  cookies().set("access_token", json.access_token, {
    httpOnly: true,
    sameSite: "strict",
    expires: Date.now() * (1000 * 3600)
  });
  cookies().set("refresh_token", json.refresh_token, {
    httpOnly: true,
    sameSite: "strict",
    expires: Date.now() * (1000 * 3600 * 24 * 30)
  });
  redirect("/");
}
