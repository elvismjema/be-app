-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);

-- Couples
create table public.couples (
  id uuid primary key default gen_random_uuid(),
  user1_id uuid references auth.users on delete cascade not null,
  user2_id uuid references auth.users on delete cascade not null,
  next_meetup date,
  last_meetup date,
  created_at timestamptz default now(),
  unique(user1_id, user2_id)
);
alter table public.couples enable row level security;
create policy "Couple members can view couple" on public.couples for select using (auth.uid() = user1_id or auth.uid() = user2_id);
create policy "Couple members can update couple" on public.couples for update using (auth.uid() = user1_id or auth.uid() = user2_id);
create policy "Users can create couple" on public.couples for insert with check (auth.uid() = user1_id);

-- Invitations
create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  inviter_id uuid references auth.users on delete cascade not null,
  email text not null,
  token text unique not null default encode(gen_random_bytes(32), 'hex'),
  accepted boolean default false,
  created_at timestamptz default now()
);
alter table public.invitations enable row level security;
create policy "Inviters can view own invitations" on public.invitations for select using (auth.uid() = inviter_id);
create policy "Inviters can create invitations" on public.invitations for insert with check (auth.uid() = inviter_id);
create policy "Anyone can view invitation by token" on public.invitations for select using (true);
create policy "Anyone can accept invitation" on public.invitations for update using (true);

-- Calendar Events
create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references public.couples on delete cascade not null,
  author_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  start_date timestamptz not null,
  end_date timestamptz,
  is_meetup boolean default false,
  created_at timestamptz default now()
);
alter table public.calendar_events enable row level security;
create policy "Couple members can manage events" on public.calendar_events for all
  using (exists (select 1 from public.couples where id = couple_id and (user1_id = auth.uid() or user2_id = auth.uid())));

-- Todos
create table public.todos (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references public.couples on delete cascade not null,
  author_id uuid references auth.users on delete cascade not null,
  title text not null,
  completed boolean default false,
  created_at timestamptz default now()
);
alter table public.todos enable row level security;
create policy "Couple members can manage todos" on public.todos for all
  using (exists (select 1 from public.couples where id = couple_id and (user1_id = auth.uid() or user2_id = auth.uid())));

-- Notes
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references public.couples on delete cascade not null,
  author_id uuid references auth.users on delete cascade not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.notes enable row level security;
create policy "Couple members can manage notes" on public.notes for all
  using (exists (select 1 from public.couples where id = couple_id and (user1_id = auth.uid() or user2_id = auth.uid())));

-- Journal Entries
create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references public.couples on delete cascade not null,
  author_id uuid references auth.users on delete cascade not null,
  content text not null,
  mood text,
  created_at timestamptz default now()
);
alter table public.journal_entries enable row level security;
create policy "Couple members can manage journal" on public.journal_entries for all
  using (exists (select 1 from public.couples where id = couple_id and (user1_id = auth.uid() or user2_id = auth.uid())));

-- Moments (photos)
create table public.moments (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references public.couples on delete cascade not null,
  author_id uuid references auth.users on delete cascade not null,
  photo_url text not null,
  caption text,
  created_at timestamptz default now()
);
alter table public.moments enable row level security;
create policy "Couple members can manage moments" on public.moments for all
  using (exists (select 1 from public.couples where id = couple_id and (user1_id = auth.uid() or user2_id = auth.uid())));

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Storage bucket for moments/photos
insert into storage.buckets (id, name, public) values ('moments', 'moments', true);
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

create policy "Anyone can view moments" on storage.objects for select using (bucket_id = 'moments');
create policy "Authenticated users can upload moments" on storage.objects for insert with check (bucket_id = 'moments' and auth.role() = 'authenticated');
create policy "Users can delete own moments" on storage.objects for delete using (bucket_id = 'moments' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Anyone can view avatars" on storage.objects for select using (bucket_id = 'avatars');
create policy "Authenticated users can upload avatars" on storage.objects for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- Messages (chat)
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references public.couples on delete cascade not null,
  author_id uuid references auth.users on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);
alter table public.messages enable row level security;
create policy "Couple members can manage messages" on public.messages for all
  using (exists (select 1 from public.couples where id = couple_id and (user1_id = auth.uid() or user2_id = auth.uid())));

-- Vault (secure shared items)
create table public.vault_items (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references public.couples on delete cascade not null,
  author_id uuid references auth.users on delete cascade not null,
  label text not null,
  value text not null,
  category text default 'other',
  created_at timestamptz default now()
);
alter table public.vault_items enable row level security;
create policy "Couple members can manage vault" on public.vault_items for all
  using (exists (select 1 from public.couples where id = couple_id and (user1_id = auth.uid() or user2_id = auth.uid())));

-- Add timezone + last_seen to profiles
alter table public.profiles add column if not exists timezone text default 'UTC';
alter table public.profiles add column if not exists last_seen_at timestamptz default now();
