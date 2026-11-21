# Total divergente

## Pergunta de negócio

Quais registros apresentam total divergente?

## SQL

```sql
SELECT n.nota_id, n.total, SUM(i.quantidade * i.valor_unitario) AS total_itens
FROM dbo.notas AS n JOIN dbo.nota_itens AS i ON i.nota_id = n.nota_id
GROUP BY n.nota_id, n.total
HAVING n.total <> SUM(i.quantidade * i.valor_unitario);
```

## Resultado esperado

Para a carga versionada: nota_id=1, total=110, total_itens=100. O gabarito identifica `total_nota`: `{"nota_id": 1}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta na triagem de total divergente, antes de investigar e corrigir a origem dos dados.
