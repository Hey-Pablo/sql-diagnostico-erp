SELECT m.movimento_id, m.produto_id FROM dbo.estoque_movimentos AS m
JOIN dbo.produtos AS p ON p.produto_id = m.produto_id
WHERE p.ativo = 0 AND m.tipo = 'SAIDA';
