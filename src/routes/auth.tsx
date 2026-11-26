import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/upvet/auth-layout";
import { safeRedirect } from "@/lib/upvet/safe-redirect";

const meta = [
  { title: "Entrar | UPVET" },
  { name: "description", content: "Acesso restrito às equipes das clínicas cadastradas no UPVET." },
  { property: "og:title", content: "Entrar | UPVET" },
  { property: "og:description", content: "Acesso restrito às equipes das clínicas cadastradas no UPVET." },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary" },
];

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: safeRedirect(s["redirect"]) }),
  head: () => ({ meta }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "ok"; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: redirect, replace: true });
    });
  }, [navigate, redirect]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      setMessage({ type: "error", text: "E-mail ou senha incorretos, ou acesso ainda não autorizado pela clínica." });
      return;
    }
    navigate({ to: redirect, replace: true });
  }

  async function forgot(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    setMessage({ type: "ok", text: "Se o e-mail estiver cadastrado, você receberá um link para criar uma nova senha." });
  }

  return (
    <AuthLayout
      title={mode === "login" ? "Acesse sua clínica" : "Recuperar senha"}
      subtitle={
        mode === "login"
          ? "Acesso exclusivo para equipes convidadas pelo administrador da clínica."
          : "Informe seu e-mail para receber o link de redefinição."
      }
    >
      <form className="auth-form" onSubmit={mode === "login" ? login : forgot}>
        <label>
          E-mail
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        {mode === "login" && (
          <label>
            Senha
            <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
        )}
        {message && <p className={`auth-msg ${message.type}`} role="status">{message.text}</p>}
        <Button type="submit" disabled={busy} className="auth-submit">
          {busy ? "Aguarde..." : mode === "login" ? "Entrar" : "Enviar link"}
        </Button>
        <button
          type="button"
          className="auth-link"
          onClick={() => {
            setMode(mode === "login" ? "forgot" : "login");
            setMessage(null);
          }}
        >
          {mode === "login" ? "Esqueci minha senha" : "Voltar para o login"}
        </button>
      </form>
    </AuthLayout>
  );
}
