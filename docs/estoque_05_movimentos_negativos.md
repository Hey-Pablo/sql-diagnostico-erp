# Movimentos com quantidade negativa

## Pergunta de negócio

Lançamentos com valores negativos em estoque podem ser legítimos (devoluções) ou erros de digitação. Quais movimentos possuem quantidade negativa, indicando necessidade de validação manual?

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

Use esta consulta para validar lançamentos de estoque, detectar erros de digitação, ou auditorar devoluções e ajustes.