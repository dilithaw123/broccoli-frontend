"use server";

import { cookies } from "next/headers"
import Link from "next/link";
import { redirect } from "next/navigation";

async function logout() {
	"use server";
	(await cookies()).delete("session");
	(await cookies()).delete("access_token");
	(await cookies()).delete("refresh_token");
	redirect("/login");
}

export async function Header() {
	const session = (await cookies()).get("session");
	return (
		<div className="navbar items-end flex flex w-full">
			<h1 className="text-6xl mr-10 place-self-start">Broccoli Standups</h1>
			<Link href="/" className="text-5xl mr-10 place-self-end">Home</Link>
			{session &&
				<form className="text-5xl place-self-end" action={logout}>
					<button className="navbar-button" id="logout" type="submit">Logout</button>
				</form>
			}
		</div >
	);
}
