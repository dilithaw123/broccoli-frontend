import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
  const json = await response.json();
  console.log(json);
  cookies().set("session", JSON.stringify(json), {
    httpOnly: true,
    sameSite: "strict",
  });
  redirect("/");
}
