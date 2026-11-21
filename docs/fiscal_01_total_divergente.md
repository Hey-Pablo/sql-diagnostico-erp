# Total divergente nas notas

## Pergunta de negócio

Quando o total calculado dos itens não bate com o total da nota, o SPED rejeita e o cliente pode reclamar sobre cobrança incorreta. Quais notas possuem divergência entre o valor do total e a soma dos itens?

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

Use esta consulta antes do envio ao SPED, ao gerar relatório de fiscalização, ou quando há pendência de lançamento contábil.