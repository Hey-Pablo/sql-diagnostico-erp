WITH grupos AS (
    SELECT titulo_id, cliente_id, numero_documento, parcela,
           COUNT(*) OVER (PARTITION BY cliente_id, numero_documento, parcela) AS quantidade
    FROM dbo.titulos
)
SELECT titulo_id, cliente_id, numero_documento, parcela FROM grupos WHERE quantidade > 1;
