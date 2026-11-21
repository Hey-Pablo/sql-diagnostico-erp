SELECT n.nota_id, n.total, SUM(i.quantidade * i.valor_unitario) AS total_itens
FROM dbo.notas AS n JOIN dbo.nota_itens AS i ON i.nota_id = n.nota_id
GROUP BY n.nota_id, n.total
HAVING n.total <> SUM(i.quantidade * i.valor_unitario);
