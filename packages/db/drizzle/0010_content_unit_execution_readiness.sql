CREATE OR REPLACE FUNCTION enforce_content_unit_execution_readiness()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'SCRIPT_READY'
     AND OLD.status IS DISTINCT FROM NEW.status
     AND NOT EXISTS (
       SELECT 1
       FROM content_execution_revisions cer
       WHERE cer.content_unit_id = NEW.id
         AND cer.artist_id = NEW.artist_id
         AND cer.status = 'APPROVED'
     )
  THEN
    RAISE EXCEPTION 'CONTENT_UNIT_EXECUTION_REQUIRED'
      USING ERRCODE = '23514',
            DETAIL = 'ContentUnit requires an approved ContentExecutionRevision before SCRIPT_READY.';
  END IF;
  RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER content_units_execution_readiness_trigger
BEFORE UPDATE OF status ON content_units
FOR EACH ROW
EXECUTE FUNCTION enforce_content_unit_execution_readiness();
