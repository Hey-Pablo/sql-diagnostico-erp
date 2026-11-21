SELECT t.titulo_id, t.nota_id, t.valor, n.total
FROM dbo.titulos AS t JOIN dbo.notas AS n ON n.nota_id = t.nota_id
WHERE t.valor <> n.total;
