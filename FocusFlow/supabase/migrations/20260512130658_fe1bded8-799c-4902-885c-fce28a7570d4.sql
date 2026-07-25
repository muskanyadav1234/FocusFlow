
-- Enums
create type public.task_priority as enum ('low', 'medium', 'high');
create type public.task_status as enum ('pending', 'in_progress', 'completed');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Profiles updatable by owner"
  on public.profiles for update
  using (auth.uid() = id);

-- Tasks
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text default '',
  priority public.task_priority not null default 'medium',
  status public.task_status not null default 'pending',
  deadline timestamptz,
  tags text[] not null default '{}',
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "Tasks viewable by owner"
  on public.tasks for select using (auth.uid() = user_id);
create policy "Tasks insertable by owner"
  on public.tasks for insert with check (auth.uid() = user_id);
create policy "Tasks updatable by owner"
  on public.tasks for update using (auth.uid() = user_id);
create policy "Tasks deletable by owner"
  on public.tasks for delete using (auth.uid() = user_id);

create index tasks_user_idx on public.tasks(user_id);
create index tasks_deadline_idx on public.tasks(deadline);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger tasks_updated_at before update on public.tasks
  for each row execute function public.set_updated_at();

-- Auto profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)));
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Avatars bucket
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

create policy "Avatars publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users upload own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users update own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users delete own avatar"
  on storage.objects for delete
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
