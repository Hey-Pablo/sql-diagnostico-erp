SELECT t.titulo_id FROM dbo.titulos AS t
LEFT JOIN dbo.notas AS n ON n.nota_id = t.nota_id
WHERE n.nota_id IS NULL;
