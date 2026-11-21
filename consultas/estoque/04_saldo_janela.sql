WITH saldos AS (
    SELECT produto_id, SUM(quantidade) OVER (PARTITION BY produto_id) AS saldo,
           ROW_NUMBER() OVER (PARTITION BY produto_id ORDER BY movimento_id) AS linha
    FROM dbo.estoque_movimentos
)
SELECT produto_id, saldo FROM saldos WHERE linha = 1 AND saldo < 0;
