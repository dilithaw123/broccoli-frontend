"use server";

import { cookies } from "next/headers";
import SessionCarousel from "./components/session_carousel";

async function startSession(groupId: string): Promise<number> {
	const groupIdNumber = parseInt(groupId);
	if (isNaN(groupIdNumber)) {
		throw new Error("Invalid group ID");
	}
	const response = await fetch(`${process.env.BACKEND_URL}/session`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Cookie: cookies.toString(),
		},
		body: JSON.stringify({ groupId: groupIdNumber }),

	});
	const data = await response.json();
	if (!data.id) {
		throw new Error("Internal server error");
	}
	return data.id;
}

async function getUserIdFromCookies() {
	const token = cookies().get("session");
	if (!token) {
		throw new Error("Unauthorized");
	}
	const json = JSON.parse(token.value);
	if (!json.id) {
		throw new Error("Unauthorized");
	}
	return json.id;
}

type Params = {
	id: string;
}

type SearchParams = {
	group: string;
}

export default async function SessionPage(props: { params: Params, searchParams: SearchParams }) {
	const groupName = props.searchParams.group;
	const groupId = props.params.id;
	const sessionId = await startSession(groupId);
	const userId = await getUserIdFromCookies();

	return (
		<div className="h-full p-10">
			<div className="flex justify-between items-center flex-row">
				<h1 className="text-4xl font-bold mb-10">Session for group {groupName}</h1>
			</div>

			<SessionCarousel sessionId={sessionId} userId={userId} />
		</div >
	);
}
