import { GroupsView } from "@/components/groups";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Broccoli Standups - Home",
};

type Group = {
  id: string;
  name: string;
  allowed_emails: string[];
};

async function getGroups(): Promise<Group[]> {
  "use server";
  const session = cookies().get("session");
  const user = JSON.parse(session?.value || "{}");
  if (!user.email) return [];
  const response = await fetch(`${process.env.BACKEND_URL}/user/group?email=${user.email}`);
  if (!response.ok) {
    throw new Error("Internal server error");
  }
  return await response.json();
}

export default async function Home() {
  const groups = await getGroups();

  return (
    <div className="h-full p-10">
      <h1 className="text-4xl font-bold mb-10">Welcome to Broccoli Standups!</h1>
      <h2 className="text-2xl font-semibold">Your groups:</h2>
      <GroupsView groups={groups} />
    </div>
  );
}
