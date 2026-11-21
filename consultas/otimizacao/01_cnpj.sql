-- No SSMS, habilite o plano de execução real. Compare leituras e duração.
-- Antes: varredura da tabela; depois: índice criado por schema/02_indices.sql.
SET STATISTICS IO ON;
SET STATISTICS TIME ON;
SELECT cliente_id, cnpj FROM dbo.clientes WITH (INDEX(0)) WHERE cnpj = '00000000000001';
SELECT cliente_id, cnpj FROM dbo.clientes WITH (INDEX(IX_clientes_cnpj)) WHERE cnpj = '00000000000001';
SET STATISTICS TIME OFF;
SET STATISTICS IO OFF;
