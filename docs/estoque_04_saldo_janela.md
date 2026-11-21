# Saldo janela

## Pergunta de negócio

Quais registros apresentam saldo janela?

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

Use esta consulta na triagem de saldo janela, antes de investigar e corrigir a origem dos dados.
