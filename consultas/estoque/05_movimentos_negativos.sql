WITH negativos AS (
    SELECT produto_id FROM dbo.estoque_movimentos GROUP BY produto_id HAVING SUM(quantidade) < 0
)
SELECT m.movimento_id, m.produto_id, m.quantidade FROM dbo.estoque_movimentos AS m
JOIN negativos AS n ON n.produto_id = m.produto_id;
