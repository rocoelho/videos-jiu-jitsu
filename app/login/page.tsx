"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { login } from "./actions";

const CASAS = 6;

export default function Login() {
  const [state, action, pending] = useActionState(login, null);
  const [pin, setPin] = useState<string[]>(Array(CASAS).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const enviado = useRef(false);

  const completo = pin.every((d) => d !== "");

  // Envia sozinho assim que o sexto digito entra.
  useEffect(() => {
    if (completo && !enviado.current && !pending) {
      enviado.current = true;
      formRef.current?.requestSubmit();
    }
    if (!completo) enviado.current = false;
  }, [completo, pending]);

  // Erro: limpa, treme e volta para a primeira casa.
  useEffect(() => {
    if (state?.error) {
      setPin(Array(CASAS).fill(""));
      enviado.current = false;
      refs.current[0]?.focus();
    }
  }, [state]);

  function escreve(i: number, valor: string) {
    const digitos = valor.replace(/\D/g, "");
    if (!digitos) return;
    const novo = [...pin];
    // Colar preenche da casa atual em diante.
    for (let k = 0; k < digitos.length && i + k < CASAS; k++) novo[i + k] = digitos[k];
    setPin(novo);
    const destino = Math.min(i + digitos.length, CASAS - 1);
    refs.current[destino]?.focus();
  }

  function tecla(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      const novo = [...pin];
      if (novo[i]) novo[i] = "";
      else if (i > 0) {
        novo[i - 1] = "";
        refs.current[i - 1]?.focus();
      }
      setPin(novo);
    } else if (e.key === "ArrowLeft" && i > 0) {
      e.preventDefault();
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < CASAS - 1) {
      e.preventDefault();
      refs.current[i + 1]?.focus();
    }
  }

  return (
    <main className="login">
      <form action={action} ref={formRef}>
        <h1>Estudo Faixa Preta</h1>
        <p className="dica">Digite os 6 numeros de acesso</p>

        <input type="hidden" name="password" value={pin.join("")} />

        <div className={`pin${state?.error ? " erro" : ""}`}>
          {pin.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className={d ? "cheio" : ""}
              value={d}
              onChange={(e) => escreve(i, e.target.value)}
              onKeyDown={(e) => tecla(i, e)}
              onFocus={(e) => e.target.select()}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              pattern="[0-9]*"
              maxLength={CASAS}
              aria-label={`Numero ${i + 1} de ${CASAS}`}
              autoFocus={i === 0}
              disabled={pending}
            />
          ))}
        </div>

        <button type="submit" disabled={pending || !completo}>
          {pending ? "Entrando..." : "Entrar"}
        </button>

        <p className="erro" role="alert" aria-live="polite">
          {state?.error ?? ""}
        </p>
      </form>
    </main>
  );
}
