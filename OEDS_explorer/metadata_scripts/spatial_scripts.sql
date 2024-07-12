-- Search for geometry field names
SELECT table_name, column_name
FROM information_schema.columns
WHERE ((column_name LIKE 'lat%')
	OR (column_name LIKE 'Lat%')
	OR (column_name LIKE 'lae%')
	OR (column_name LIKE 'Lae%')
	OR (column_name LIKE 'Geo%')
	OR (column_name LIKE 'geo%')	
	OR (column_name LIKE 'Land%')	
	OR (column_name LIKE 'land%')	
	OR (column_name LIKE 'Country%')	
	OR (column_name LIKE 'country%')	
    )
	and table_schema = 'mastr';


-- Bounding hull from lat lon points
SELECT
    ST_Transform(
        ST_ConcaveHull(
            ST_Collect(
                ST_SetSRID(
                    ST_MakePoint(lon, lat),
                    4326
                )
            ),
            0.5
        ),
        4326
    ) AS bounding_geometry
FROM
    e2watch.buildings;

-- Bounding hull from geometry
SELECT
    ST_Transform(ST_ConcaveHull(ST_Collect(ST_Points(ST_Simplify(geometry, 20))),0.5), 4326) AS bounding_geometry
FROM
    nrw_kwp_waermedichte.waermedichte;

-- Map Nuts data to column names of a table
WITH country_nuts AS (
    SELECT
        cntr_code,
        nuts_id,
        latitude,
        longitude,
        geometry
    FROM
        public.nuts
    WHERE
        levl_code = 0
)

, ninja_country_codes AS (
    SELECT
        column_name AS country_code
    FROM
        information_schema.columns
    WHERE
        table_schema = 'ninja'
        AND table_name = 'capacity_solar_merra2'
        AND column_name ~ '^[a-z]{2}$'
)

, joined_data AS (
    SELECT
        ncc.country_code,
        cn.nuts_id,
        cn.latitude,
        cn.longitude,
        cn.geometry
    FROM
        ninja_country_codes ncc
        LEFT JOIN country_nuts cn ON   Upper(ncc.country_code) = cn.cntr_code
)

SELECT
    country_code,
    nuts_id,
    latitude,
    longitude,
    geometry
FROM
    joined_data
ORDER BY
    nuts_id IS NULL,
    country_code;

