# Notas sem itens

## Pergunta de negócio

Notas cadastradas sem itens indicam falha na importação ou processamento, evitando a emissão de documento fiscal completo. Quais notas não possuem itens vinculados?

## SQL

```sql
SELECT n.nota_id FROM dbo.notas AS n
LEFT JOIN dbo.nota_itens AS i ON i.nota_id = n.nota_id
WHERE i.nota_id IS NULL;
```

## Resultado esperado

Para a carga versionada: nota_id=2. O gabarito identifica `nota_sem_itens`: `{"nota_id": 2}`. A ordem das linhas não são garantida.

## Quando usar

Use esta consulta antes do envio ao SPED, ao gerar relatório de fiscalização, ou quando há pendência de lançamento contábil.