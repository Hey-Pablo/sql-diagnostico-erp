-- Habilite o plano de execução real no SSMS e compare as duas instruções.
SET STATISTICS IO ON;
SET STATISTICS TIME ON;
SELECT produto_id, SUM(quantidade) AS saldo FROM dbo.estoque_movimentos WITH (INDEX(0)) WHERE produto_id = 1 GROUP BY produto_id;
SELECT produto_id, SUM(quantidade) AS saldo FROM dbo.estoque_movimentos WITH (INDEX(IX_estoque_produto_data)) WHERE produto_id = 1 GROUP BY produto_id;
SET STATISTICS TIME OFF;
SET STATISTICS IO OFF;
