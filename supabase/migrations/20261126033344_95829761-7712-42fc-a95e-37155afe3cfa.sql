ALTER FUNCTION public.can_access_finance(uuid) SECURITY INVOKER;
ALTER FUNCTION public.is_platform_admin() SECURITY INVOKER;

DO $tests$
DECLARE u uuid; a uuid:=gen_random_uuid(); b uuid:=gen_random_uuid(); m uuid:=gen_random_uuid(); denied boolean; n integer;
BEGIN
 SELECT user_id INTO u FROM public.upvet_clinic_members LIMIT 1;
 IF u IS NULL THEN RAISE EXCEPTION 'Testes exigem usuário existente'; END IF;
 BEGIN
 INSERT INTO public.upvet_clinics(id,clinic_name) VALUES(a,'Teste A'),(b,'Teste B');
 INSERT INTO public.upvet_clinic_members(id,clinic_id,user_id,member_role) VALUES(m,a,u,'admin');
 denied:=false; BEGIN INSERT INTO public.upvet_clinic_members(clinic_id,user_id,member_role) VALUES(b,u,'super_admin'); EXCEPTION WHEN invalid_parameter_value THEN denied:=true; END;
 IF NOT denied THEN RAISE EXCEPTION 'Falha papel Super Admin no vínculo'; END IF;
 denied:=false; BEGIN INSERT INTO public.upvet_member_permissions(clinic_id,member_id,permission) VALUES(b,m,'financeiro.ver'); EXCEPTION WHEN invalid_parameter_value THEN denied:=true; END;
 IF NOT denied THEN RAISE EXCEPTION 'Falha permissão cruzada'; END IF;
 INSERT INTO public.upvet_platform_admins(user_id) VALUES(u);
 PERFORM set_config('request.jwt.claim.sub',u::text,true);
 PERFORM set_config('request.jwt.claims',json_build_object('sub',u,'role','authenticated')::text,true);
 PERFORM set_config('role','authenticated',true);
 IF NOT public.is_platform_admin() THEN RAISE EXCEPTION 'Falha leitura Super Admin próprio'; END IF;
 IF public.can_access_finance(b) THEN RAISE EXCEPTION 'Falha bypass financeiro Super Admin'; END IF;
 denied:=false; BEGIN INSERT INTO public.upvet_clinic_invites(clinic_id,email,member_role) VALUES(b,'teste@example.invalid','financeiro'); EXCEPTION WHEN insufficient_privilege THEN denied:=true; END;
 IF NOT denied THEN RAISE EXCEPTION 'Falha convite externo admin'; END IF;
 denied:=false; BEGIN INSERT INTO public.upvet_clinic_invites(clinic_id,email,member_role,invited_by) VALUES(a,'teste@example.invalid','financeiro',gen_random_uuid()); EXCEPTION WHEN insufficient_privilege THEN denied:=true; END;
 IF NOT denied THEN RAISE EXCEPTION 'Falha falsificação convidante'; END IF;
 PERFORM set_config('role','postgres',true);
 UPDATE public.upvet_clinics SET is_active=false WHERE id=a;
 PERFORM set_config('role','authenticated',true);
 IF public.has_active_clinic_access(a) OR public.can_access_finance(a) THEN RAISE EXCEPTION 'Falha clínica inativa'; END IF;
 SELECT count(*) INTO n FROM public.upvet_clinics WHERE id=a; IF n<>0 THEN RAISE EXCEPTION 'Falha leitura clínica inativa'; END IF;
 RAISE EXCEPTION 'UPVET_TESTS_ROLLBACK_OK' USING ERRCODE='P0002';
 EXCEPTION WHEN SQLSTATE 'P0002' THEN
 IF SQLERRM<>'UPVET_TESTS_ROLLBACK_OK' THEN RAISE; END IF;
 RAISE NOTICE 'UPVET: testes adicionais passaram; todos os dados de teste foram revertidos.';
 END;
END; $tests$;