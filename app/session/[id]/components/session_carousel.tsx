"use client";
import { useEffect, useRef, useState } from "react";

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
	const websocket = useRef<WebSocket | null>(null);

	useEffect(() => {
		const fetchInitial = async () => {
			if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
				return;
			}
			const url = new URL(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/submission');
			url.searchParams.append("session_id", props.sessionId.toString());
			url.searchParams.append("user_id", props.userId);
			const resp = await fetch(url.toString());
			if (!resp.ok) {
				return;
			}
			const userSub = await resp.json();
			if (userSub?.yesterday) {
				(document.getElementById("yesterday_box") as HTMLTextAreaElement).value = userSub?.yesterday.join('\n');
			}
			if (userSub?.today) {
				(document.getElementById("today_box") as HTMLTextAreaElement).value = userSub?.today.join('\n');
			}
			if (userSub?.blockers) {
				(document.getElementById("blockers_box") as HTMLTextAreaElement).value = userSub?.blockers.join('\n');
			}
		}
		fetchInitial().catch(console.error);
	}, []);

	useEffect(() => {
		if (!process.env.NEXT_PUBLIC_WEBSOCKET_URL) throw new Error("NEXT_PUBLIC_WEBSOCKET_URL not set");
		websocket.current = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/session/${props.sessionId}`);
		websocket.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (Array.isArray(data)) {
				setSubmissions(data);
			} else {
				const user_id = data.user_id;
				document.querySelector<HTMLAnchorElement>(`#${submissions.find(sub => sub.user_id === user_id)?.name}`)?.click();
			}
		}
		return () => {
			websocket.current?.close();
		}
	}, []);


	function openModal() {
		(document.getElementById('sub_modal') as HTMLDialogElement).showModal();
	}

	function closeModal() {
		(document.getElementById('sub_modal') as HTMLDialogElement).close();
	}

	async function shuffle() {
		const url = process.env.NEXT_PUBLIC_BACKEND_URL;
		if (!url) {
			return
		}
		await fetch(url + `/session/${props.sessionId}/shuffle`, {
			method: "POST"
		});
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
		});
		if (response.ok) {
			closeModal();
		}
	}

	async function sendUserChange(event: React.MouseEvent<HTMLAnchorElement>) {
		const user_id = submissions.find(sub => sub.name === event.currentTarget.hash.slice(1))?.user_id;
		if (!user_id) {
			return;
		}
		const data = {
			user_id: user_id,
		};
		websocket.current?.send(JSON.stringify(data));
	}

	return (
		<>
			<dialog id="sub_modal" className="modal">
				<div className="modal-box">
					<p className="">Press ESC key or click outside to close</p>
					<form method="POST" className="dialog flex flex-col space-y-2" onSubmit={submitForm}>
						<textarea id="yesterday_box" name="yesterday" placeholder="Yesterday" className="textarea textarea-primary" />
						<textarea id="today_box" name="today" placeholder="Today" className="textarea textarea-primary" />
						<textarea id="blockers_box" name="blockers" placeholder="Blockers" className="textarea textarea-primary" />
						<br />
						<button type="submit" className="btn btn-primary">Submit</button>
					</form>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
			<div className="flex justify-between items-center flex-col self-center items-center space-y-2">
				<div className="flex flex-row space-x-3">
					<button className="btn btn-secondary" onClick={shuffle}>Shuffle</button>
					<button className="btn btn-secondary" onClick={openModal}>Check In</button>
				</div>
				<div className="carousel rounded-box w-2/3 h-3/4 border-secondary">
					<h3 className="text-center font-bold text-lg">No submissions - Go on, write something!</h3>
					{submissions.map((submission, ind) => (
						<div className="relative carousel-item w-full top-1/2 flex flex-col self-center min-h-full" key={submission.user_id} id={submission.name}>
							<div className="absolute left-5 right-5 top-1/2 flex justify-between">
								<a href={`#${submissions.at(ind - 1)?.name}`} className="btn btn-circle btn-secondary" onClick={sendUserChange}>❮</a>
								<a href={`#${ind + 1 == submissions.length ? submissions.at(0)?.name : submissions.at(ind + 1)?.name}`} className="btn btn-circle btn-secondary" onClick={sendUserChange}>❯</a>
							</div>
							<div className="self-center">
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

						</div>
					))}
				</div>
				{submissions.length > 1 &&
					<div className="flex w-full justify-center gap-2 py-2">
						{submissions.map((submission) => (
							<a key={`#${submission.name}`} href={`#${submission.name}`} className="btn btn-xs" onClick={sendUserChange}>{submission.name}</a>
						))}
					</div>
				}
			</div >
		</>
	);
}
