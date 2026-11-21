# Saldo negativo

## Pergunta de negócio

Quais registros apresentam saldo negativo?

## SQL

```sql
SELECT produto_id, SUM(quantidade) AS saldo FROM dbo.estoque_movimentos
GROUP BY produto_id HAVING SUM(quantidade) < 0;
```

## Resultado esperado

Para a carga versionada: produto_id=1, saldo=-1. O gabarito identifica `estoque_negativo`: `{"produto_id": 1}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta na triagem de saldo negativo, antes de investigar e corrigir a origem dos dados.
