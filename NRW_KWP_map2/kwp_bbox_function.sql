DROP FUNCTION kwp_nrw_by_bbox;

DROP TYPE IF EXISTS kpw_nrw_map_info;

CREATE TYPE kpw_nrw_map_info AS (
    Fest_ID bigint,
    Gemeinde text,
    Strasse text,
    HAUSNR double precision,
    Nutzung text,
    GEBAEUDETYP text,
    Nutzflaeche double precision,
    RW_WW_spez double precision,
    RW_WW double precision,
	geometry text
);
CREATE OR REPLACE FUNCTION public.kwp_nrw_by_bbox(
    in_xmin DOUBLE PRECISION,
    in_ymin DOUBLE PRECISION,
    in_xmax DOUBLE PRECISION,
    in_ymax DOUBLE PRECISION
)
RETURNS SETOF kpw_nrw_map_info AS $$
BEGIN
    RETURN QUERY SELECT 
        "Fest_ID",        
        "Gemeinde",
        "Strasse",
        "HAUSNR",
        "Nutzung",
        "GEBAEUDETYP",
        "Nutzflaeche",
        "RW_WW_spez",
        "RW_WW",
        ST_AsText(ST_Transform(geometry, 4326)) AS geometry
    FROM nrw_kwp_waermedichte.waermedichte
    WHERE ST_Contains(
        ST_Transform(
            ST_MakeEnvelope(in_xmin, in_ymin, in_xmax, in_ymax, 4326),
            25832
        ),
        ST_Transform(geometry, 25832)
    )
    AND "Nutzflaeche" > 10   
    LIMIT 40000;
END;
$$ LANGUAGE plpgsql STABLE;
NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';