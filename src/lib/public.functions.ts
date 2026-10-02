import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import type { Course } from './site';

export function publicClient() {
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  const url = process.env['SUPABASE_URL'];
  if (!key || !url) throw new Error('Course catalog is temporarily unavailable.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => {
    const headers = new Headers(init?.headers);
    if (headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
    headers.set('apikey', key);
    return fetch(input, { ...init, headers });
  } } });
}
export const getCourses = createServerFn({ method: 'GET' }).handler(async (): Promise<Course[]> => {
  const { data, error } = await publicClient().from('courses').select('id,title,slug,description,duration,start_date,learning_mode,schedule,weekly_hours,tuition_kes,tuition_usd,is_active').eq('is_active', true).order('tuition_kes', { ascending: false });
  if (error) throw new Error('Could not load courses. Please try again.');
  return data ?? [];
});

const email = z.string().trim().email().max(255);
const name = z.string().trim().min(2).max(100);
const antiSpam = { website: z.string().max(0).default('') };
const applicationSchema = z.object({ full_name: name, email, contact_number: z.string().trim().regex(/^\+?[0-9\s()-]{7,25}$/), current_location: z.string().trim().min(2).max(120), course_id: z.string().uuid(), consent_given: z.literal(true), ...antiSpam });
const feedbackSchema = z.object({ full_name: z.string().trim().max(100).optional(), email: z.union([email, z.literal('')]).optional(), category: z.enum(['General Feedback','Course Content','Learning Experience','Website Experience','Suggestions','Other']), message: z.string().trim().min(5).max(3000), ...antiSpam });
const contactSchema = z.object({ full_name: name, email, subject: z.string().trim().min(2).max(160), message: z.string().trim().min(5).max(3000), ...antiSpam });
export const submitApplication = createServerFn({ method: 'POST' }).inputValidator((data: unknown) => applicationSchema.parse(data)).handler(async ({ data }) => {
  if (data.website) throw new Error('Invalid submission.');
  const { data: result, error } = await publicClient().rpc('submit_application' as never, { _full_name: data.full_name, _email: data.email, _contact_number: data.contact_number, _current_location: data.current_location, _course_id: data.course_id } as never);
  if (error?.message?.includes('course_unavailable')) throw new Error('That course is not currently available.');
  if (error?.code === '23505') throw new Error('An application for this course has already been submitted with this email address.');
  if (error) throw new Error('Your application could not be submitted. Please try again.');
  return { reference: result as unknown as string };
});
export const submitFeedback = createServerFn({ method: 'POST' }).inputValidator((data: unknown) => feedbackSchema.parse(data)).handler(async ({ data }) => {
  if (data.website) throw new Error('Invalid submission.');
  const { error } = await publicClient().rpc('submit_feedback' as never, { _full_name: data.full_name || null, _email: data.email || null, _category: data.category, _message: data.message } as never);
  if (error) throw new Error('Feedback could not be submitted. Please try again.');
  return { ok: true };
});
export const submitContact = createServerFn({ method: 'POST' }).inputValidator((data: unknown) => contactSchema.parse(data)).handler(async ({ data }) => {
  if (data.website) throw new Error('Invalid submission.');
  const { error } = await publicClient().rpc('submit_contact' as never, { _full_name: data.full_name, _email: data.email, _subject: data.subject, _message: data.message } as never);
  if (error) throw new Error('Your message could not be sent. Please try again.');
  return { ok: true };
});
