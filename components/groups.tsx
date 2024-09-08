"use client";

type Group = {
	id: string;
	name: string;
	allowed_emails: string[];
};

type Props = {
	groups: Group[];
};

async function startSession(group_id: string, group_name: string) {
	window.location.href = `/session/${group_id}?group=${group_name}`;
};


export function GroupsView(props: Props) {
	return (
		props.groups.map((group) => (
			<div key={group.id} className="p-5 m-5 border-2 border-gray-200 rounded-md">
				<h2 className="text-2xl font-semibold">{group.name}</h2>
				<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => startSession(group.id, group.name)}>Start session</button>
			</div>
		))
	)

}
