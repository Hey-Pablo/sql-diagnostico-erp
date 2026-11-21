-- Habilite o plano de execução real no SSMS e compare as duas instruções.
SET STATISTICS IO ON;
SET STATISTICS TIME ON;
SELECT titulo_id, cliente_id, numero_documento, parcela FROM dbo.titulos WITH (INDEX(0)) WHERE cliente_id = 4 AND numero_documento = 'DUP' AND parcela = 1;
SELECT titulo_id, cliente_id, numero_documento, parcela FROM dbo.titulos WITH (INDEX(IX_titulos_documento)) WHERE cliente_id = 4 AND numero_documento = 'DUP' AND parcela = 1;
SET STATISTICS TIME OFF;
SET STATISTICS IO OFF;
