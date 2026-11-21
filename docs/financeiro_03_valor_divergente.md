# Valor divergente

## Pergunta de negócio

Quais registros apresentam valor divergente?

## SQL

```sql
SELECT t.titulo_id, t.nota_id, t.valor, n.total
FROM dbo.titulos AS t JOIN dbo.notas AS n ON n.nota_id = t.nota_id
WHERE t.valor <> n.total;
```

## Resultado esperado

Para a carga versionada: titulo_id=4 e 301, nota_id=4, valor=120, total=100. O gabarito identifica `titulo_valor_divergente`: `{"titulo_ids": [4, 301]}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta na triagem de valor divergente, antes de investigar e corrigir a origem dos dados.
