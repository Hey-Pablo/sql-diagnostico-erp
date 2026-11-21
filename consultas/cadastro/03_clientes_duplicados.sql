WITH duplicados AS (
    SELECT cnpj FROM dbo.clientes GROUP BY cnpj HAVING COUNT(*) > 1
)
SELECT c.cliente_id, c.cnpj FROM dbo.clientes AS c JOIN duplicados AS d ON d.cnpj = c.cnpj;
