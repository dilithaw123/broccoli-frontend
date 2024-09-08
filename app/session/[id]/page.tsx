"use server";

async function startSession(groupId: string): Promise<number> {
	const groupIdNumber = parseInt(groupId);
	if (isNaN(groupIdNumber)) {
		throw new Error("Invalid group ID");
	}
	const response = await fetch(`${process.env.BACKEND_URL}/session`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ groupId: groupIdNumber }),
	});
	const data = await response.json();
	if (!data.id) {
		throw new Error("Internal server error");
	}
	return data.id;
}

export default async function SessionPage(props: { params: { id: string }, searchParams: { [key: string]: string } }) {
	const groupName = props.searchParams.group;
	const groupId = props.params.id;
	const sessionId = await startSession(groupId);

	return (
		<div className="h-full p-10">
			<h1 className="text-4xl font-bold mb-10">Session for group {groupName}</h1>
		</div>
	);
}
