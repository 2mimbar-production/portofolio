-- Ringkasan insight channel & program untuk web etalase.
-- Diisi harian oleh Apps Script (spreadsheet "Insight Channel Duamimbar")
-- lewat fungsi simpan_insight yang memeriksa kunci rahasia.
create table if not exists public.insight_web (
  id text primary key,
  data jsonb not null,
  diperbarui timestamptz not null default now()
);
alter table public.insight_web enable row level security;
create policy "publik baca insight" on public.insight_web for select to anon, authenticated using (true);

-- Kunci rahasia: tanpa policy, jadi tidak bisa dibaca/diubah lewat API.
create table if not exists public.insight_kunci (
  kunci text primary key,
  dibuat timestamptz not null default now()
);
alter table public.insight_kunci enable row level security;

create or replace function public.simpan_insight(p_kunci text, p_data jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.insight_kunci where kunci = p_kunci) then
    raise exception 'kunci salah';
  end if;
  insert into public.insight_web (id, data, diperbarui)
  values ('terbaru', p_data, now())
  on conflict (id) do update set data = excluded.data, diperbarui = now();
end;
$$;

revoke all on function public.simpan_insight(text, jsonb) from public;
grant execute on function public.simpan_insight(text, jsonb) to anon;

-- Buat satu kunci acak (lihat isinya lewat SQL Editor untuk diisi ke Setelan.gs).
insert into public.insight_kunci (kunci) values (encode(gen_random_bytes(24), 'hex'));
