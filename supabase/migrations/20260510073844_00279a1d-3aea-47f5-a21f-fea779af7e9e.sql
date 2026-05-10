CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  requested_role text;
  final_role app_role;
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.raw_user_meta_data->>'phone'
  );

  requested_role := NEW.raw_user_meta_data->>'role';
  IF requested_role = 'instructor' THEN
    final_role := 'instructor'::app_role;
  ELSE
    final_role := 'student'::app_role;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, final_role);

  RETURN NEW;
END;
$function$;