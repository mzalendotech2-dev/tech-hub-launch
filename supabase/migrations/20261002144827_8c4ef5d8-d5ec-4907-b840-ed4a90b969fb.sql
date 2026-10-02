CREATE OR REPLACE FUNCTION public.submit_application(_full_name text, _email text, _contact_number text, _current_location text, _course_id uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE ref text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM courses WHERE id = _course_id AND is_active) THEN RAISE EXCEPTION 'course_unavailable'; END IF;
  INSERT INTO applications (full_name, email, contact_number, current_location, course_id, consent_given)
  VALUES (_full_name, _email, _contact_number, _current_location, _course_id, true) RETURNING reference_number INTO ref;
  RETURN ref;
END $$;
CREATE OR REPLACE FUNCTION public.submit_feedback(_full_name text, _email text, _category text, _message text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO feedback (full_name, email, category, message) VALUES (_full_name, _email, _category, _message);
$$;
CREATE OR REPLACE FUNCTION public.submit_contact(_full_name text, _email text, _subject text, _message text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO contact_inquiries (full_name, email, subject, message) VALUES (_full_name, _email, _subject, _message);
$$;
CREATE OR REPLACE FUNCTION public.record_site_event(_event_type text, _target text, _visitor_id uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO site_events (event_type, target, visitor_id, event_day) VALUES (_event_type, _target, _visitor_id, current_date)
  ON CONFLICT DO NOTHING;
$$;
REVOKE ALL ON FUNCTION public.submit_application(text,text,text,text,uuid), public.submit_feedback(text,text,text,text), public.submit_contact(text,text,text,text), public.record_site_event(text,text,uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_application(text,text,text,text,uuid), public.submit_feedback(text,text,text,text), public.submit_contact(text,text,text,text), public.record_site_event(text,text,uuid) TO anon, authenticated, service_role;