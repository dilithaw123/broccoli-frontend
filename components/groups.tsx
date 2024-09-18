"use client";

type Group = {
	id: string;
	name: string;
	allowed_emails: string[];
};

type Props = {
	groups: Group[];
	email: string;
};


export function GroupsView(props: Props) {

	async function startSession(group_id: string, group_name: string) {
		window.location.href = `/session/${group_id}?group=${group_name}`;
	};

	async function inviteUser(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);
		let group_id = formData.get("group_id")?.toString();
		if (!group_id) {
			alert("Group ID not found");
			return;
		}
		let email = formData.get("email")?.toString();
		if (!email) {
			alert("Email not found");
			return;
		}
		const response = await fetch(form.action, {
			method: "POST",
			body: JSON.stringify({ group_id: +group_id, email, request_email: props.email }),
			// TODO: Fix this
			mode: "no-cors",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			alert("Failed to invite user");
		}

	};


	return (
		<>
			{
				props.groups?.map((group) => (
					<div key={group.id} className="p-5 m-5 border-2 border-gray-200 rounded-md">
						<h2 className="text-2xl font-semibold mb-3">{group.name}</h2>
						<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3" onClick={() => startSession(group.id, group.name)}>Start session</button>
						<form method="POST" action={process.env.NEXT_PUBLIC_BACKEND_URL + "/group/user/add"} onSubmit={inviteUser}>
							<input type="email" name="email" placeholder="Email" className="input input-bordered mr-5" />
							<input type="hidden" name="group_id" value={group.id} />
							<button type="submit" className="btn btn-primary">Invite</button>
						</form>

					</div>
				))
			}
			{!props.groups || props.groups.length === 0 &&
				<>
					<h2 className="text-2xl font-semibold">No groups found</h2>
					<p className="text-gray-500">Create a group to start a session...</p>
					<p className="text-gray-500">Or ask your group to invite you!</p>
				</>
			}
		</>
	)
}
