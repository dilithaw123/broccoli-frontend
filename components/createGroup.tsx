"use client";

import { FormEvent } from "react";

type Props = {
	email: string,
};

export function CreateGroup(props: Props) {

	function openModal() {
		(document.getElementById('create_group') as HTMLDialogElement).showModal();
	}

	function closeModal() {
		(document.getElementById('create_group') as HTMLDialogElement).close();
	}


	async function createGroup(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		const timezone = formData.get("timezone");
		const email = formData.get("email");
		const name = formData.get("name");
		const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/group`, {
			method: "POST",
			body: JSON.stringify({ name, timezone, allowed_emails: [email] }),
		});
		if (!response.ok) {
			const text = await response.text();
			alert(text);
		} else {
			e.currentTarget.reset()
			closeModal()
			window.location.reload()
		}
	}

	return (
		<>
			<button className="btn btn-secondary" onClick={openModal}>Create Group</button>
			<dialog id="create_group" className="modal">
				<div className="modal-box">
					<form className="dialog flex flex-col space-y-2" onSubmit={createGroup}>
						<input name="name" placeholder="Group Name" className="input input-primary" />
						<input name="timezone" hidden={true} defaultValue={Intl.DateTimeFormat().resolvedOptions().timeZone} readOnly={true} />
						<input name="email" hidden={true} defaultValue={props.email} readOnly={true} />
						<br />
						<button type="submit" className="btn btn-primary">Submit</button>
					</form>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</>
	);
}
