# Títulos sem nota fiscal

## Pergunta de negócio

Títulos cadastrados sem nota fiscal vinculada indicam falha na integração com a SEFAZ, evitando a baixa do contabil. Quais títulos não possuem nota fiscal relacionada?

## SQL

```sql
SELECT t.titulo_id FROM dbo.titulos AS t
LEFT JOIN dbo.notas AS n ON n.nota_id = t.nota_id
WHERE n.nota_id IS NULL;
```

## Resultado esperado

Para a carga versionada: titulo_id=3. O gabarito identifica `titulo_sem_nota`: `{"titulo_id": 3}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta antes do envio ao SPED, ao gerar relatório de fiscalização, ou quando há pendência de lançamento contábil.