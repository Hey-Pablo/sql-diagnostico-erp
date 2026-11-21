# Títulos com valor divergente

## Pergunta de negócio

Quando o valor do título não bate com o total da nota fiscal, há divergência na contabilização. O SPED rejeita essas incidências e o cliente pode reclamar sobre cobrança incorreta. Quais títulos possuem valor diferente do total da nota?

## SQL

```sql
SELECT t.titulo_id, t.nota_id, t.valor, n.total
FROM dbo.titulos AS t JOIN dbo.notas AS n ON n.nota_id = t.nota_id
WHERE t.valor <> n.total;
```

## Resultado esperado

Para a carga versionada: titulo_id=4 e 301, nota_id=4, valor=120, total=100. O gabarito identifica `titulo_valor_divergente`: `{"titulo_ids": [4, 301]}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta antes do envio ao SPED, ao gerar relatório de fiscalização, ou quando há pendência de lançamento contábil.