SELECT produto_id, SUM(quantidade) AS saldo FROM dbo.estoque_movimentos
GROUP BY produto_id HAVING SUM(quantidade) < 0;
