# Títulos em faixas de atraso

## Pergunta de negócio

Títulos em atraso precisam de acompanhamento: até 30 dias podem ser tratados normalmente, de 31 a 60 exigem contato do SAC, e acima de 60 dias podem exigir renegociação. Em que faixa cada título em atraso está?

## SQL

```sql
-- Data de referência fixa torna o resultado reproduzível.
DECLARE @referencia date = '2025-03-15';
WITH atrasos AS (
    SELECT titulo_id, DATEDIFF(day, data_vencimento, @referencia) AS dias
    FROM dbo.titulos WHERE data_pagamento IS NULL AND data_vencimento <= @referencia
)
SELECT titulo_id, dias, CASE WHEN dias <= 30 THEN '0-30' WHEN dias <= 60 THEN '31-60' ELSE '60+' END AS faixa
FROM atrasos;
```

## Resultado esperado

Para a carga versionada: titulo_id=4 e 301, dias=42, faixa=31-60. O gabarito identifica `titulo_duplicado`: `{"titulo_ids": [4, 301]}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta no controle de cobrança, para gerar relatório de atrasos, ou ao triar títulos para contato do SAC.