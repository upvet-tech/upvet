import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/upvet/auth-layout";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nova senha | UPVET" },
      { name: "description", content: "Defina uma nova senha de acesso ao UPVET." },
      { property: "og:title", content: "Nova senha | UPVET" },
      { property: "og:description", content: "Defina uma nova senha de acesso ao UPVET." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const isRecovery = window.location.hash.includes("type=recovery");
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    supabase.auth.getSession().then(({ data: s }) => {
      if (s.session && isRecovery) setReady(true);
    });
    if (isRecovery) setReady(true);
    return () => data.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("A senha deve ter pelo menos 8 caracteres.");
    if (password !== confirm) return setError("As senhas não coincidem.");
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) return setError("Não foi possível alterar a senha. Solicite um novo link.");
    navigate({ to: "/", replace: true });
  }

  return (
    <AuthLayout title="Criar nova senha" subtitle={ready ? "Digite e confirme sua nova senha." : "Abra esta página pelo link enviado ao seu e-mail."}>
      {ready ? (
        <form className="auth-form" onSubmit={submit}>
          <label>
            Nova senha
            <input type="password" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <label>
            Confirmar senha
            <input type="password" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </label>
          {error && <p className="auth-msg error" role="status">{error}</p>}
          <Button type="submit" disabled={busy} className="auth-submit">{busy ? "Aguarde..." : "Salvar nova senha"}</Button>
        </form>
      ) : (
        <div className="auth-form">
          <button type="button" className="auth-link" onClick={() => navigate({ to: "/auth", search: { redirect: "/" } })}>Voltar para o login</button>
        </div>
      )}
    </AuthLayout>
  );
}
