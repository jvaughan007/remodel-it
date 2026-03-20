-- Atomically claim leads needing admin reminders (2+ days old, still "new").
-- Sets admin_reminder_sent_at and returns the claimed rows.
CREATE OR REPLACE FUNCTION claim_admin_reminder_leads()
RETURNS SETOF leads
LANGUAGE sql
AS $$
  UPDATE leads
  SET admin_reminder_sent_at = NOW()
  WHERE id IN (
    SELECT id FROM leads
    WHERE status = 'new'
      AND created_at < NOW() - INTERVAL '2 days'
      AND admin_reminder_sent_at IS NULL
    LIMIT 50
    FOR UPDATE SKIP LOCKED
  )
  RETURNING *;
$$;

-- Atomically claim leads needing customer follow-ups (5+ days old, admin already reminded).
-- Sets customer_followup_sent_at and returns the claimed rows.
CREATE OR REPLACE FUNCTION claim_customer_followup_leads()
RETURNS SETOF leads
LANGUAGE sql
AS $$
  UPDATE leads
  SET customer_followup_sent_at = NOW()
  WHERE id IN (
    SELECT id FROM leads
    WHERE status = 'new'
      AND created_at < NOW() - INTERVAL '5 days'
      AND admin_reminder_sent_at IS NOT NULL
      AND customer_followup_sent_at IS NULL
    LIMIT 50
    FOR UPDATE SKIP LOCKED
  )
  RETURNING *;
$$;
