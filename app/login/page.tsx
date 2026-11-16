"use client";
import { useActionState } from "react";
import { login } from "./actions";

export default function Login() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <main className="login">
      <form action={action}>
        <h1>Estudo Faixa Preta</h1>
        <input name="password" type="password" placeholder="Senha" autoFocus required />
        <button disabled={pending}>{pending ? "Entrando..." : "Entrar"}</button>
        {state?.error && <p className="erro">{state.error}</p>}
      </form>
    </main>
  );
}
