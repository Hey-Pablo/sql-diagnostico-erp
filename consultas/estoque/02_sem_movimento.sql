SELECT p.produto_id FROM dbo.produtos AS p
LEFT JOIN dbo.estoque_movimentos AS m ON m.produto_id = p.produto_id
WHERE m.movimento_id IS NULL;
