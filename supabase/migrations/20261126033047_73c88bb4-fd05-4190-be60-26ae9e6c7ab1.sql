GRANT SELECT ON public.upvet_clinics, public.upvet_clinic_members TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.upvet_appointments TO authenticated;
GRANT ALL ON public.upvet_clinics, public.upvet_clinic_members, public.upvet_appointments TO service_role;

CREATE TABLE public.upvet_platform_admins (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
 is_active boolean NOT NULL DEFAULT true,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.upvet_platform_admins TO authenticated;
GRANT ALL ON public.upvet_platform_admins TO service_role;
ALTER TABLE public.upvet_platform_admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY platform_admin_read_own ON public.upvet_platform_admins FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

CREATE FUNCTION public.has_clinic_role(target_clinic_id uuid, allowed_roles text[]) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT EXISTS (SELECT 1 FROM public.upvet_clinic_members m JOIN public.upvet_clinics c ON c.id=m.clinic_id
 WHERE m.clinic_id=target_clinic_id AND m.user_id=(SELECT auth.uid()) AND m.is_active AND c.is_active AND m.member_role=ANY(allowed_roles));
$$;
REVOKE ALL ON FUNCTION public.has_clinic_role(uuid,text[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_clinic_role(uuid,text[]) TO authenticated, service_role;
CREATE FUNCTION public.can_access_finance(target_clinic_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT public.has_clinic_role(target_clinic_id, ARRAY['admin','financeiro']::text[]);
$$;
REVOKE ALL ON FUNCTION public.can_access_finance(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.can_access_finance(uuid) TO authenticated, service_role;
CREATE FUNCTION public.is_platform_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT EXISTS(SELECT 1 FROM public.upvet_platform_admins WHERE user_id=(SELECT auth.uid()) AND is_active);
$$;
REVOKE ALL ON FUNCTION public.is_platform_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO authenticated, service_role;
CREATE FUNCTION public.has_active_clinic_access(target_clinic_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT EXISTS(SELECT 1 FROM public.upvet_clinic_members m JOIN public.upvet_clinics c ON c.id=m.clinic_id
 WHERE m.clinic_id=target_clinic_id AND m.user_id=(SELECT auth.uid()) AND m.is_active AND c.is_active);
$$;
REVOKE ALL ON FUNCTION public.has_active_clinic_access(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_active_clinic_access(uuid) TO authenticated, service_role;
CREATE POLICY clinics_read_member ON public.upvet_clinics FOR SELECT TO authenticated USING (public.has_active_clinic_access(id));
CREATE POLICY members_read_own_or_clinic_admin ON public.upvet_clinic_members FOR SELECT TO authenticated USING (
 (user_id=(SELECT auth.uid()) AND public.has_active_clinic_access(clinic_id)) OR public.has_clinic_role(clinic_id,ARRAY['admin']::text[]));
CREATE POLICY appointments_active_clinic_guard ON public.upvet_appointments AS RESTRICTIVE FOR ALL TO authenticated
 USING (public.has_active_clinic_access(clinic_id)) WITH CHECK (public.has_active_clinic_access(clinic_id));

CREATE FUNCTION public.validate_clinic_member_role() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$ BEGIN
 IF NEW.member_role NOT IN ('admin','veterinario','recepcionista','financeiro','estoque') THEN
 RAISE EXCEPTION 'Papel de clínica inválido' USING ERRCODE='22023'; END IF;
 RETURN NEW; END; $$;
CREATE TRIGGER validate_clinic_member_role BEFORE INSERT OR UPDATE OF member_role ON public.upvet_clinic_members
 FOR EACH ROW EXECUTE FUNCTION public.validate_clinic_member_role();
ALTER TABLE public.upvet_clinic_members ALTER COLUMN member_role SET DEFAULT 'recepcionista';
CREATE FUNCTION public.prevent_appointment_clinic_transfer() RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$ BEGIN
 IF NEW.clinic_id IS DISTINCT FROM OLD.clinic_id THEN RAISE EXCEPTION 'Não é permitido transferir agendamentos entre clínicas' USING ERRCODE='42501'; END IF;
 RETURN NEW; END; $$;
CREATE TRIGGER prevent_appointment_clinic_transfer BEFORE UPDATE OF clinic_id ON public.upvet_appointments FOR EACH ROW EXECUTE FUNCTION public.prevent_appointment_clinic_transfer();

CREATE TABLE public.upvet_clinic_invites (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), clinic_id uuid NOT NULL REFERENCES public.upvet_clinics(id),
 email text NOT NULL, member_role text NOT NULL, invited_by uuid NOT NULL DEFAULT auth.uid(),
 expires_at timestamptz NOT NULL DEFAULT (now()+interval '7 days'), accepted_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.upvet_clinic_invites TO authenticated;
GRANT ALL ON public.upvet_clinic_invites TO service_role;
ALTER TABLE public.upvet_clinic_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY invites_read_clinic_admin ON public.upvet_clinic_invites FOR SELECT TO authenticated USING (public.has_clinic_role(clinic_id,ARRAY['admin']::text[]));
CREATE POLICY invites_create_clinic_admin ON public.upvet_clinic_invites FOR INSERT TO authenticated WITH CHECK (
 public.has_clinic_role(clinic_id,ARRAY['admin']::text[]) AND invited_by=(SELECT auth.uid()) AND accepted_at IS NULL);
CREATE FUNCTION public.validate_clinic_invite() RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$ BEGIN
 IF NEW.member_role NOT IN ('admin','veterinario','recepcionista','financeiro','estoque') OR btrim(NEW.email)='' OR position('@' in NEW.email)=0 THEN
 RAISE EXCEPTION 'Convite inválido' USING ERRCODE='22023'; END IF;
 IF NEW.expires_at <= now() THEN RAISE EXCEPTION 'Validade do convite deve ser futura' USING ERRCODE='22023'; END IF;
 RETURN NEW; END; $$;
CREATE TRIGGER validate_clinic_invite BEFORE INSERT OR UPDATE ON public.upvet_clinic_invites FOR EACH ROW EXECUTE FUNCTION public.validate_clinic_invite();

CREATE TABLE public.upvet_member_permissions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), clinic_id uuid NOT NULL REFERENCES public.upvet_clinics(id),
 member_id uuid NOT NULL REFERENCES public.upvet_clinic_members(id) ON DELETE CASCADE,
 permission text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(member_id,permission)
);
GRANT SELECT ON public.upvet_member_permissions TO authenticated;
GRANT ALL ON public.upvet_member_permissions TO service_role;
ALTER TABLE public.upvet_member_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY permissions_read_own_or_admin ON public.upvet_member_permissions FOR SELECT TO authenticated USING (
 public.has_clinic_role(clinic_id,ARRAY['admin']::text[]) OR
 (public.has_active_clinic_access(clinic_id) AND EXISTS(SELECT 1 FROM public.upvet_clinic_members m WHERE m.id=member_id AND m.clinic_id=upvet_member_permissions.clinic_id AND m.user_id=(SELECT auth.uid()) AND m.is_active)));
CREATE FUNCTION public.validate_member_permission_clinic() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM public.upvet_clinic_members WHERE id=NEW.member_id AND clinic_id=NEW.clinic_id) THEN
 RAISE EXCEPTION 'Permissão e membro devem pertencer à mesma clínica' USING ERRCODE='22023'; END IF;
 RETURN NEW; END; $$;
CREATE TRIGGER validate_member_permission_clinic BEFORE INSERT OR UPDATE ON public.upvet_member_permissions FOR EACH ROW EXECUTE FUNCTION public.validate_member_permission_clinic();
CREATE FUNCTION public.upvet_touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$ BEGIN NEW.updated_at=now(); RETURN NEW; END; $$;
CREATE TRIGGER platform_admin_touch BEFORE UPDATE ON public.upvet_platform_admins FOR EACH ROW EXECUTE FUNCTION public.upvet_touch_updated_at();
CREATE TRIGGER clinic_invite_touch BEFORE UPDATE ON public.upvet_clinic_invites FOR EACH ROW EXECUTE FUNCTION public.upvet_touch_updated_at();
CREATE TRIGGER member_permission_touch BEFORE UPDATE ON public.upvet_member_permissions FOR EACH ROW EXECUTE FUNCTION public.upvet_touch_updated_at();
REVOKE ALL ON FUNCTION public.validate_clinic_member_role(),public.prevent_appointment_clinic_transfer(),public.validate_clinic_invite(),public.validate_member_permission_clinic(),public.upvet_touch_updated_at() FROM PUBLIC, anon, authenticated;
CREATE INDEX upvet_members_user_clinic_idx ON public.upvet_clinic_members(user_id,clinic_id);
CREATE INDEX upvet_appointments_clinic_idx ON public.upvet_appointments(clinic_id);
CREATE INDEX upvet_invites_clinic_idx ON public.upvet_clinic_invites(clinic_id);
CREATE INDEX upvet_permissions_clinic_idx ON public.upvet_member_permissions(clinic_id);

-- Testes reais sob RLS. O bloco interno reverte TODOS os dados de teste.
DO $tests$
DECLARE u uuid; a uuid:=gen_random_uuid(); b uuid:=gen_random_uuid(); r text; n integer; denied boolean; fixture_id bigint;
BEGIN
 SELECT user_id INTO u FROM public.upvet_clinic_members LIMIT 1;
 IF u IS NULL THEN RAISE EXCEPTION 'Testes exigem um usuário existente'; END IF;
 SELECT coalesce(min(id),0)-100 INTO fixture_id FROM public.upvet_appointments;
 BEGIN
 INSERT INTO public.upvet_clinics(id,clinic_name) VALUES(a,'Teste transacional A'),(b,'Teste transacional B');
 INSERT INTO public.upvet_clinic_members(clinic_id,user_id,member_role) VALUES(a,u,'recepcionista');
 INSERT INTO public.upvet_appointments(id,patient_name,tutor_name,veterinarian_name,appointment_type,appointment_date,appointment_time,clinic_id)
 VALUES(fixture_id,'Teste A','Teste','Teste','Consulta',current_date,'10:00',a),(fixture_id-1,'Teste B','Teste','Teste','Consulta',current_date,'11:00',b);
 PERFORM set_config('request.jwt.claim.sub',u::text,true);
 PERFORM set_config('request.jwt.claims',json_build_object('sub',u,'role','authenticated')::text,true);
 PERFORM set_config('role','authenticated',true);
 SELECT count(*) INTO n FROM public.upvet_clinics WHERE id IN(a,b); IF n<>1 THEN RAISE EXCEPTION 'Falha isolamento leitura clínicas'; END IF;
 SELECT count(*) INTO n FROM public.upvet_appointments WHERE clinic_id IN(a,b); IF n<>1 THEN RAISE EXCEPTION 'Falha isolamento leitura agenda'; END IF;
 UPDATE public.upvet_appointments SET status='Confirmed' WHERE id=fixture_id; GET DIAGNOSTICS n=ROW_COUNT; IF n<>1 THEN RAISE EXCEPTION 'Falha atualização própria'; END IF;
 UPDATE public.upvet_appointments SET status='Confirmed' WHERE id=fixture_id-1; GET DIAGNOSTICS n=ROW_COUNT; IF n<>0 THEN RAISE EXCEPTION 'Falha atualização externa'; END IF;
 INSERT INTO public.upvet_appointments(id,patient_name,tutor_name,veterinarian_name,appointment_type,appointment_date,appointment_time,clinic_id)
 VALUES(fixture_id-2,'Teste próprio','Teste','Teste','Consulta',current_date,'12:00',a);
 denied:=false; BEGIN
 INSERT INTO public.upvet_appointments(id,patient_name,tutor_name,veterinarian_name,appointment_type,appointment_date,appointment_time,clinic_id)
 VALUES(fixture_id-3,'Teste externo','Teste','Teste','Consulta',current_date,'12:00',b);
 EXCEPTION WHEN insufficient_privilege THEN denied:=true; END; IF NOT denied THEN RAISE EXCEPTION 'Falha criação externa'; END IF;
 denied:=false; BEGIN UPDATE public.upvet_clinic_members SET member_role='admin' WHERE user_id=u; EXCEPTION WHEN insufficient_privilege THEN denied:=true; END;
 IF NOT denied THEN RAISE EXCEPTION 'Falha autopromoção'; END IF;
 denied:=false; BEGIN INSERT INTO public.upvet_member_permissions(clinic_id,member_id,permission) SELECT a,id,'financeiro.ver' FROM public.upvet_clinic_members WHERE clinic_id=a; EXCEPTION WHEN insufficient_privilege THEN denied:=true; END;
 IF NOT denied THEN RAISE EXCEPTION 'Falha autoatribuição'; END IF;
 denied:=false; BEGIN INSERT INTO public.upvet_platform_admins(user_id) VALUES(u); EXCEPTION WHEN insufficient_privilege THEN denied:=true; END;
 IF NOT denied OR public.is_platform_admin() THEN RAISE EXCEPTION 'Falha separação Super Admin'; END IF;
 FOREACH r IN ARRAY ARRAY['admin','veterinario','recepcionista','financeiro','estoque'] LOOP
 PERFORM set_config('role','postgres',true);
 UPDATE public.upvet_clinic_members SET member_role=r WHERE clinic_id=a;
 PERFORM set_config('role','authenticated',true);
 IF public.can_access_finance(a) IS DISTINCT FROM (r IN ('admin','financeiro')) THEN RAISE EXCEPTION 'Falha financeiro papel %',r; END IF;
 IF public.can_access_finance(b) THEN RAISE EXCEPTION 'Falha financeiro outra clínica'; END IF;
 denied:=false; BEGIN INSERT INTO public.upvet_clinic_invites(clinic_id,email,member_role) VALUES(a,'teste@example.invalid','recepcionista'); EXCEPTION WHEN insufficient_privilege THEN denied:=true; END;
 IF denied IS DISTINCT FROM (r<>'admin') THEN RAISE EXCEPTION 'Falha convite papel %',r; END IF;
 END LOOP;
 PERFORM set_config('role','postgres',true);
 INSERT INTO public.upvet_clinic_members(clinic_id,user_id,member_role) VALUES(b,u,'admin');
 PERFORM set_config('role','authenticated',true);
 denied:=false; BEGIN UPDATE public.upvet_appointments SET clinic_id=b WHERE id=fixture_id; EXCEPTION WHEN insufficient_privilege THEN denied:=true; END;
 IF NOT denied THEN RAISE EXCEPTION 'Falha transferência entre clínicas'; END IF;
 PERFORM set_config('role','postgres',true);
 UPDATE public.upvet_clinic_members SET is_active=false WHERE clinic_id=a;
 PERFORM set_config('role','authenticated',true);
 IF public.has_active_clinic_access(a) OR public.can_access_finance(a) THEN RAISE EXCEPTION 'Falha vínculo inativo'; END IF;
 SELECT count(*) INTO n FROM public.upvet_appointments WHERE clinic_id=a; IF n<>0 THEN RAISE EXCEPTION 'Falha leitura inativa'; END IF;
 PERFORM set_config('role','anon',true);
 denied:=false; BEGIN PERFORM id FROM public.upvet_clinics; EXCEPTION WHEN insufficient_privilege THEN denied:=true; END;
 IF NOT denied THEN RAISE EXCEPTION 'Falha visitante'; END IF;
 RAISE EXCEPTION 'UPVET_TESTS_ROLLBACK_OK' USING ERRCODE='P0002';
 EXCEPTION WHEN SQLSTATE 'P0002' THEN
 IF SQLERRM <> 'UPVET_TESTS_ROLLBACK_OK' THEN RAISE; END IF;
 RAISE NOTICE 'UPVET: testes de isolamento, escrita, cinco papéis, convites, autopromoção, Super Admin, inatividade e visitante passaram; fixtures revertidas.';
 END;
END;
$tests$;