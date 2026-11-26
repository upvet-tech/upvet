# Fase 01 — Alterações estruturais propostas (NÃO executadas)

Nada abaixo exclui, altera ou duplica tabelas, funções ou políticas existentes. O RLS continua ligado.

1. **Acesso para usuários logados** às tabelas `upvet_clinics`, `upvet_clinic_members` e `upvet_appointments` (visitantes sem login continuam bloqueados). Hoje o app receberia "acesso negado".
2. **Lista fixa de papéis da clínica:** admin, veterinario, recepcionista, financeiro, estoque (validação nova em `member_role`; o membro "admin" atual continua válido).
3. **Super Admin UPVET separado:** nova tabela `upvet_platform_admins`, sem nenhuma regra que permita gravação pelo app — só pode ser concedido diretamente no painel do Supabase. Administradores de clínica não conseguem se promover.
4. **Novas funções de verificação** (a `is_clinic_member` atual fica como está): `has_clinic_role(clínica, papéis)`, `can_access_finance(clínica)` (admin ou financeiro) e `is_platform_admin()`.
5. **Novas regras de leitura:** cada membro vê o próprio vínculo e a própria clínica; o admin da clínica vê os membros da clínica dele.
6. **Convites:** nova tabela `upvet_clinic_invites` (e-mail, papel, clínica, validade). Só o admin da clínica cria e vê os convites da própria clínica.
7. **Permissões personalizadas (futuro):** nova tabela `upvet_member_permissions` (membro + permissão, ex.: `financeiro.ver`), já isolada por clínica e consultada por `can_access_finance`.

Configuração no painel do Supabase (feita por você): desativar "Allow new users to sign up" em Authentication → Sign In / Providers, para impedir cadastro público.
