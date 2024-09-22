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
  console.log("Request", data);
  const response = await fetch(`${process.env.BACKEND_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
  console.log(json);
  cookies().set("session", JSON.stringify(json.user), {
    httpOnly: true,
    sameSite: "strict",
    expires: Date.now() * (1000 * 60 * 60 * 24)
  });
  cookies().set("access-token", json.access_token, {
    httpOnly: true,
    sameSite: "strict",
  });
  cookies().set("refresh-token", json.refresh_token, {
    httpOnly: true,
    sameSite: "strict",
    expires: Date.now() * (1000 * 60 * 60 * 24)
  });
  redirect("/");
}
