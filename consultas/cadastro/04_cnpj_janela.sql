WITH classificados AS (
    SELECT cliente_id, cnpj, COUNT(*) OVER (PARTITION BY cnpj) AS quantidade FROM dbo.clientes
)
SELECT cliente_id, cnpj FROM classificados WHERE quantidade > 1;
