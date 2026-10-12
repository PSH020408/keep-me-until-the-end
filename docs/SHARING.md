# Shared memorial (모두의 주마등)

Players can post a finished life to a shared table so that other players can replay it. The site is
static, so the table lives in a free **Supabase** project (Postgres with a REST API). The browser
only reads and inserts; it can never change or delete a row.

What is stored per life: the signer's nickname, the species, the cause of death, whether the life was
lived out, promises kept, and the life record used by the replay (story lines, broken promises, the
last words). Nothing else — no account, no IP address in the table, no tracking. Posting is opt-in
(a ticked box under "keep this life"), and the footer says that names and endings become public.

## Set up (once)

1. Create a free project at supabase.com (region: Northeast Asia (Seoul)).
2. **SQL Editor → New query**, paste the block below, **Run**.
3. **Project Settings → API**: copy the *Project URL* and the *anon public* key into
   `public/js/share.js` (`SHARE_CFG.url`, `SHARE_CFG.key`), commit and push. The anon key is meant to
   be public; what it can do is limited by the policies below.

```sql
create table public.lives (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  nick        text not null check (char_length(nick) between 1 and 12),
  species     text not null check (char_length(species) <= 20),
  cause       text not null check (char_length(cause) <= 20),
  calm        boolean not null default false,
  kept        smallint check (kept between 0 and 9),
  ver         text check (char_length(ver) <= 12),
  rec         jsonb not null check (pg_column_size(rec) < 24000)
);

alter table public.lives enable row level security;

create policy "anyone can read"   on public.lives for select to anon using (true);
create policy "anyone can insert" on public.lives for insert to anon with check (true);
-- no update or delete policy: rows cannot be changed or removed from the browser

-- a small counter for the header line
create view public.life_stats with (security_invoker = on) as
  select count(*)::int as total, count(*) filter (where calm)::int as lived from public.lives;

grant select on public.life_stats to anon;

-- slow down floods: at most 20 posts a minute in total
create or replace function public.lives_rate_limit() returns trigger language plpgsql as $$
begin
  if (select count(*) from public.lives where created_at > now() - interval '1 minute') >= 20 then
    raise exception 'too many posts, try again in a minute';
  end if;
  return new;
end $$;
create trigger lives_rate_limit before insert on public.lives
  for each row execute function public.lives_rate_limit();
```

## Moderation

Names and last words are masked against a short list of slurs in the browser before posting and
again when shown (`clean()` in `share.js`); every field read back from the table is rebuilt with known
types and lengths before it reaches the page (`sanitizeRec()`), and all text is inserted with
`textContent`, never as HTML. To remove a post, delete the row in the Supabase **Table Editor**.

## Notes

- A free Supabase project pauses after a week without traffic; open the dashboard to resume it.
  While it is paused the shared section shows "could not load" and the game keeps working.
- Leaving `SHARE_CFG` empty hides the shared section entirely.
