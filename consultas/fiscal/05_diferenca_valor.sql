WITH totais AS (
    SELECT nota_id, SUM(quantidade * valor_unitario) AS total_itens
    FROM dbo.nota_itens GROUP BY nota_id
)
SELECT n.nota_id, n.total - t.total_itens AS diferenca
FROM dbo.notas AS n JOIN totais AS t ON t.nota_id = n.nota_id
WHERE n.total <> t.total_itens;
