import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

const targets = ['/', '/courses', '/courses/software-engineering-web', '/courses/software-engineering-mobile-app', '/courses/cybersecurity', '/about', '/contact', '/apply', '/feedback', '/privacy'] as const;
const clickTargets = ['whatsapp', 'tiktok', 'facebook'] as const;

const eventSchema = z.discriminatedUnion('event_type', [
  z.object({ event_type: z.literal('page_view'), target: z.enum(targets), visitor_id: z.string().uuid() }),
  z.object({ event_type: z.literal('social_click'), target: z.enum(clickTargets), visitor_id: z.string().uuid() }),
]);

export const recordSiteEvent = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => eventSchema.parse(input))
  .handler(async ({ data }) => {
    // A browser identifier is used only to count one visit per page per day.
    const { publicClient } = await import('./public.functions');
    const { error } = await publicClient().rpc('record_site_event' as never, { _event_type: data.event_type, _target: data.target, _visitor_id: data.visitor_id } as never);
    if (error && error.code !== '23505') throw new Error('Could not record activity.');
    return { ok: true };
  });

export const getSiteTraffic = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: role, error: roleError } = await context.supabase.from('user_roles').select('role').eq('user_id', context.userId).eq('role', 'admin').maybeSingle();
    if (roleError || !role) throw new Error('Administrator access required.');
    const totals: Record<string, number> = {};
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await context.supabase.from('site_events').select('target').range(offset, offset + 999);
      if (error) throw new Error('Could not load traffic.');
      for (const row of data ?? []) totals[row.target] = (totals[row.target] ?? 0) + 1;
      if (!data || data.length < 1000) break;
    }
    return totals;
  });