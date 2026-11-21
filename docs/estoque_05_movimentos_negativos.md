# Movimentos negativos

## Pergunta de negócio

Quais registros apresentam movimentos negativos?

## SQL

```sql
WITH negativos AS (
    SELECT produto_id FROM dbo.estoque_movimentos GROUP BY produto_id HAVING SUM(quantidade) < 0
)
SELECT m.movimento_id, m.produto_id, m.quantidade FROM dbo.estoque_movimentos AS m
JOIN negativos AS n ON n.produto_id = m.produto_id;
```

## Resultado esperado

Para a carga versionada: movimento_id=1, produto_id=1, quantidade=-1. O gabarito identifica `estoque_negativo`: `{"produto_id": 1}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta na triagem de movimentos negativos, antes de investigar e corrigir a origem dos dados.
