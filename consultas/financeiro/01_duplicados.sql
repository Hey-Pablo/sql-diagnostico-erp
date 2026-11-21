SELECT cliente_id, numero_documento, parcela, COUNT(*) AS quantidade
FROM dbo.titulos GROUP BY cliente_id, numero_documento, parcela
HAVING COUNT(*) > 1;
