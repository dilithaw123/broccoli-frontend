"use client";
import { useEffect, useState } from "react";

type Props = {
	sessionId: number;
	userId: string;
}

type UserSubmission = {
	name: string;
	id: number;
	user_id: number;
	session_id: number;
	yesterday: string[];
	today: string[];
	blockers: string[];
}


export default function SessionCarousel(props: Props): JSX.Element {
	const [submissions, setSubmissions] = useState<UserSubmission[]>([]);

	useEffect(() => {
		if (!process.env.NEXT_PUBLIC_WEBSOCKET_URL) throw new Error("NEXT_PUBLIC_WEBSOCKET_URL not set");
		const websocket = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/ws/session/${props.sessionId}`);
		websocket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (Array.isArray(data)) {
				setSubmissions(data);
			}
		}
		return () => {
			websocket.close();
		}
	}, []);

	function openModal() {
		(document.getElementById('sub_modal') as HTMLDialogElement).showModal();
	}

	function closeModal() {
		(document.getElementById('sub_modal') as HTMLDialogElement).close();
	}

	async function submitForm(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		const data = {
			yesterday: (formData.get("yesterday") as string).split("\n"),
			today: (formData.get("today") as string).split("\n"),
			blockers: (formData.get("blockers") as string).split("\n"),
			user_id: props.userId,
			session_id: props.sessionId,
		};
		//no cors
		const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/submission`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				...data,
			}),
			// TODO: remove this line
			mode: "no-cors",
		});
		if (response.ok) {
			closeModal();
		}
	}

	return (
		<>
			<dialog id="sub_modal" className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Hello!</h3>
					<p className="py-4">Press ESC key or click outside to close</p>
					<form method="POST" className="modal-backdrop" onSubmit={submitForm}>
						<textarea name="yesterday" placeholder="Yesterday" className="textarea" />
						<textarea name="today" placeholder="Today" className="textarea" />
						<textarea name="blockers" placeholder="Blockers" className="textarea" />
						<br />
						<button type="submit" className="btn btn-primary">Submit</button>
					</form>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
			<div className="flex justify-between items-center flex-col self-center items-center">
				<button className="btn" onClick={openModal}>Check In</button>
				<div className="carousel rounded-box w-2/3 h-2/3">
					<h3 className="text-center font-bold text-lg">No submissions - Go on, write something!</h3>
					{submissions.map((submission) => (
						<div className="carousel-item w-full flex flex-col self-center" key={submission.user_id} id={submission.name}>
							<h1 className="text-5xl font-bold">{submission.name}</h1>
							<div className="flex flex-col gap-2">
								<h2 className="text-3xl font-bold">Yesterday</h2>
								<ul>
									{submission.yesterday.map((item, ind) => (
										<li key={ind}>{item}</li>
									))}
								</ul>
							</div>
							<div className="flex flex-col gap-2">
								<h2 className="text-3xl font-bold">Today</h2>
								<ul>
									{submission.today.map((item, ind) => (
										<li key={ind}>{item}</li>
									))}
								</ul>
							</div>
							<div className="flex flex-col gap-2">
								<h2 className="text-3xl font-bold">Blockers</h2>
								<ul>
									{submission.blockers.map((item, ind) => (
										<li key={ind}>{item}</li>
									))}
								</ul>
							</div>
						</div>
					))}
				</div>
				{submissions.length > 1 &&
					<div className="flex w-full justify-center gap-2 py-2">
						{submissions.map((submission) => (
							<a key={`#${submission.name}`} href={`#${submission.name}`} className="btn btn-xs">{submission.name}</a>
						))}
					</div>
				}
			</div>
		</>
	);

}
