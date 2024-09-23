import { Metadata } from "next";
import { handleSubmit } from "./actions";

export const metadata: Metadata = {
  title: "Broccoli Standups - Login",
};

export default function Login() {
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">Login</h1>
      <form className="mt-10 flex flex-col w-1/3" action={handleSubmit}>
        <input className="input input-bordered mb-2" type="text" placeholder="Display Name" name="displayName" />
        <input className="input input-bordered mb-2" type="email" placeholder="Email" name="email" />
        <button className="btn btn-primary m-2" id="submit">Login</button>
      </form>
    </div>
  );
}
