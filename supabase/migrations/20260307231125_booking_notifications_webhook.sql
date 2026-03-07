-- Add status column if it doesn't exist
ALTER TABLE IF EXISTS public.bookings ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

create extension if not exists pg_net;

create or replace function public.handle_booking_notification()
returns trigger
language plpgsql
security definer
as $$
declare
  webhook_url text := 'https://vujqeldltwljtfkuffqz.supabase.co/functions/v1/notify-booking';
begin
  perform net.http_post(
    url := webhook_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'type', TG_OP,
      'record', row_to_json(NEW),
      'old_record', case when TG_OP = 'UPDATE' then row_to_json(OLD) else null end
    )
  );
  return NEW;
end;
$$;

drop trigger if exists on_booking_notification on public.bookings;
create trigger on_booking_notification
  after insert or update of status
  on public.bookings
  for each row
  execute function public.handle_booking_notification();
