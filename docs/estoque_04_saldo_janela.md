# Saldo negativo na primeira linha de movimento

## Pergunta de negócio

Em alguns sistemas, o saldo negativo só é visível na primeira movimentação da série, quando antes era zero ou positivo. Isso pode indicar erro de cálculo ou lançamento fora de sequência. Quais produtos tiveram saldo negativo desde a primeira movimentação?

## SQL

```sql
WITH saldos AS (
    SELECT produto_id, SUM(quantidade) OVER (PARTITION BY produto_id) AS saldo,
           ROW_NUMBER() OVER (PARTITION BY produto_id ORDER BY movimento_id) AS linha
    FROM dbo.estoque_movimentos
)
SELECT produto_id, saldo FROM saldos WHERE linha = 1 AND saldo < 0;
```

## Resultado esperado

Para a carga versionada: produto_id=1, saldo=-1. O gabarito identifica `estoque_negativo`: `{"produto_id": 1}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta para investigar inconsistências de saldo no início de séries, antes de corrigir valores, ou ao migrar dados entre ERPs.