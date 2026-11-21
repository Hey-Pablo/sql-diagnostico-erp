WITH sequencia AS (
    SELECT serie, numero, LAG(numero) OVER (PARTITION BY serie ORDER BY numero) AS anterior
    FROM dbo.notas
)
SELECT serie, numero, numero - anterior - 1 AS quantidade_faltante
FROM sequencia WHERE numero - anterior > 1;
