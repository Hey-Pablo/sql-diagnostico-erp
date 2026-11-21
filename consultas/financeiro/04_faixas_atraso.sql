-- Data de referência fixa torna o resultado reproduzível.
DECLARE @referencia date = '2025-03-15';
WITH atrasos AS (
    SELECT titulo_id, DATEDIFF(day, data_vencimento, @referencia) AS dias
    FROM dbo.titulos WHERE data_pagamento IS NULL AND data_vencimento <= @referencia
)
SELECT titulo_id, dias, CASE WHEN dias <= 30 THEN '0-30' WHEN dias <= 60 THEN '31-60' ELSE '60+' END AS faixa
FROM atrasos;
