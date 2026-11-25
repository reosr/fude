-- Enable Supabase Realtime for Fude account data.
-- This only adds the Fude tables; it does not replace or drop the publication.

DO $$
DECLARE
  table_name text;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_catalog.pg_publication
    WHERE pubname = 'supabase_realtime'
  ) THEN
    RAISE EXCEPTION 'Publication supabase_realtime tidak ditemukan.';
  END IF;

  FOREACH table_name IN ARRAY ARRAY[
    'fude_profiles',
    'fude_learning_progress',
    'fude_jlpt_results',
    'fude_irodori_progress',
    'fude_study_progress',
    'fude_gacha_data'
  ]
  LOOP
    IF to_regclass(format('public.%I', table_name)) IS NULL THEN
      RAISE EXCEPTION 'Tabel public.% belum tersedia.', table_name;
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM pg_catalog.pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = table_name
    ) THEN
      EXECUTE format(
        'ALTER PUBLICATION supabase_realtime ADD TABLE public.%I',
        table_name
      );
    END IF;
  END LOOP;
END
$$;
