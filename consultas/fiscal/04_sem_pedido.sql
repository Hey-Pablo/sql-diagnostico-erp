SELECT n.nota_id FROM dbo.notas AS n
LEFT JOIN dbo.pedidos AS p ON p.pedido_id = n.pedido_id
WHERE p.pedido_id IS NULL;
