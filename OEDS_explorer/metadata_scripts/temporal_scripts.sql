-- Get the min and max date for each timestamp column in each schema
DO $$
DECLARE
    r RECORD;
    s RECORD;
    overall_min_date TIMESTAMP;
    overall_max_date TIMESTAMP;
    sql TEXT;
    min_date TIMESTAMP;
    max_date TIMESTAMP;
BEGIN
    -- Temp table
    DROP TABLE IF EXISTS temp_date_ranges;
    CREATE TEMP TABLE temp_date_ranges (
        schema_name TEXT,
        table_name TEXT,
        column_name TEXT,
        min_date TIMESTAMP,
        max_date TIMESTAMP
    );

    -- Loop over schemas
    FOR s IN 
        SELECT schema_name
        FROM information_schema.schemata
        WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast', 'postgrest')
          AND schema_name NOT LIKE '%timescaledb%'
    LOOP
        overall_min_date := NULL;
        overall_max_date := NULL;

        -- Loop over timestamp columns in the current schema
        FOR r IN 
            SELECT table_name, column_name
            FROM information_schema.columns
            WHERE table_schema = s.schema_name
            AND data_type IN ('timestamp without time zone', 'timestamp with time zone')
        LOOP
            --  MIN MAX Magic
            sql := format('SELECT MIN(%I) AS min_date, MAX(%I) AS max_date FROM %I.%I', r.column_name, r.column_name, s.schema_name, r.table_name);
            EXECUTE sql INTO min_date, max_date;

            IF overall_min_date IS NULL OR min_date < overall_min_date THEN
                overall_min_date := min_date;
            END IF;
            IF overall_max_date IS NULL OR max_date > overall_max_date THEN
                overall_max_date := max_date;
            END IF;

            INSERT INTO temp_date_ranges(schema_name, table_name, column_name, min_date, max_date)
            VALUES (s.schema_name, r.table_name, r.column_name, min_date, max_date);
        END LOOP;

        -- overall min/max 
        IF overall_min_date IS NOT NULL AND overall_max_date IS NOT NULL THEN
            INSERT INTO temp_date_ranges(schema_name, table_name, column_name, min_date, max_date)
            VALUES (s.schema_name, 'OVERALL', 'OVERALL', overall_min_date, overall_max_date);
        END IF;
    END LOOP;
END $$;

SELECT * FROM temp_date_ranges;
