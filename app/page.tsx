import { CreateGroup } from "@/components/createGroup";
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
  const response = await fetch(`${process.env.BACKEND_URL}/user/group?email=${user.email}`, {
    method: "GET",
    headers: {
      Cookie: cookies().toString()
    },
  });
  if (!response.ok) {
    console.log(await response.text());
    throw new Error("Internal server error");
  }
  return await response.json();
}

export default async function Home() {
  const session = cookies().get("session");
  const user: User = JSON.parse(session?.value || "{}");
  const groups = await getGroups(user);
  return (
    <div className="min-h-screen p-10">

      <div className="flex flex-row justify-between"> <h2 className="text-2xl font-semibold">Your groups:</h2>
        <CreateGroup email={user.email} />
      </div>
      <GroupsView groups={groups} email={user.email} />
    </div>
  );
}
