"use server";

import { cookies } from "next/headers"
import { redirect } from "next/navigation";

async function logout() {
	"use server"
	cookies().delete("session");
	cookies().delete("access_token");
	cookies().delete("refresh_token");
	redirect("/login");
}

export async function Header() {
	const session = cookies().get("session");
	return (
		<div className="navbar items-end flex flex w-full">
			<h1 className="text-6xl mr-10 place-self-start">Broccoli Standups</h1>
			<a href="/" className="text-5xl mr-10 place-self-end">Home</a>
			{session &&
				<form className="text-5xl place-self-end" action={logout}>
					<button className="navbar-button" id="logout" type="submit">Logout</button>
				</form>
			}
		</div >
	);
}
