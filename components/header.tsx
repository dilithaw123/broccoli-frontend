import { cookies } from "next/headers"
import { redirect } from "next/navigation";

async function logout() {
	"use server";
	cookies().delete("session");
	redirect("/login");
}

export function Header(): JSX.Element {
	return (
		<div className="navbar">
			<h1 className="text-6xl mr-10">Broccoli Standups</h1>
			<a href="/" className="text-5xl mr-10">Home</a>
			<form className="text-4xl" action={logout}>
				<button className="navbar-button" id="logout" type="submit">Logout</button>
			</form>
		</div >
	);
}
