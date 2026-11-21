# Diferença de valor entre nota e itens

## Pergunta de negócio

Quando o total da nota não bate com o total calculado dos itens, há divergência na contabilização. O SPED rejeita e o cliente pode reclamar sobre cobrança incorreta. Quais notas possuem diferença entre o valor declarado e os itens?

## SQL

```sql
WITH totais AS (
    SELECT nota_id, SUM(quantidade * valor_unitario) AS total_itens
    FROM dbo.nota_itens GROUP BY nota_id
)
SELECT n.nota_id, n.total - t.total_itens AS diferenca
FROM dbo.notas AS n JOIN totais AS t ON t.nota_id = n.nota_id
WHERE n.total <> t.total_itens;
```

## Resultado esperado

Para a carga versionada: nota_id=1, diferenca=10. O gabarito identifica `total_nota`: `{"nota_id": 1}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta antes do envio ao SPED, ao gerar relatório de fiscalização, ou quando há pendência de lançamento contábil.