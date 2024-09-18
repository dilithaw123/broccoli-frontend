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

type User = {
  email: string;
  id: number;
  name: string;
};

async function getGroups(user: User): Promise<Group[]> {
  "use server";
  if (!user.email) return [];
  const response = await fetch(`${process.env.BACKEND_URL}/user/group?email=${user.email}`);
  if (!response.ok) {
    throw new Error("Internal server error");
  }
  return await response.json();
}

export default async function Home() {
  const session = cookies().get("session");
  const user: User = JSON.parse(session?.value || "{}");
  const groups = await getGroups(user);
  return (
    <div className="h-full p-10">
      <h1 className="text-4xl font-bold mb-10">Welcome to Broccoli Standups!</h1>
      <h2 className="text-2xl font-semibold">Your groups:</h2>
      <GroupsView groups={groups} email={user.email} />
    </div>
  );
}
