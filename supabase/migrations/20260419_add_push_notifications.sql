alter table public.profiles
add column if not exists push_token text;

alter table public.profiles
add column if not exists notification_settings jsonb default '{}'::jsonb;

create policy "Users can update their own push token"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);
