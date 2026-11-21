SELECT n.nota_id FROM dbo.notas AS n
LEFT JOIN dbo.nota_itens AS i ON i.nota_id = n.nota_id
WHERE i.nota_id IS NULL;
