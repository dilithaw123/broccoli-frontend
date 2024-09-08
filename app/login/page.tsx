import { Metadata } from "next";
import { handleSubmit } from "./actions";

export const metadata: Metadata = {
  title: "Broccoli Standups - Login",
};

export default function Login() {
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">Login</h1>
      <form className="mt-10" action={handleSubmit}>
        <input className="border border-gray-300 rounded p-2" type="text" placeholder="Display Name" name="displayName" />
        <input className="border border-gray-300 rounded p-2 mt-2" type="email" placeholder="Email" name="email" />
        <button className="bg-green-500 text-white rounded p-2 mt-2" id="submit">Login</button>
      </form>
    </div>
  );
}
