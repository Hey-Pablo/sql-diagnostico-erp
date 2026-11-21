WITH sequencia AS (
    SELECT serie, numero, LAG(numero) OVER (PARTITION BY serie ORDER BY numero) AS anterior
    FROM dbo.notas
)
SELECT serie, anterior + 1 AS primeiro_faltante, numero - 1 AS ultimo_faltante
FROM sequencia WHERE numero - anterior > 1;
