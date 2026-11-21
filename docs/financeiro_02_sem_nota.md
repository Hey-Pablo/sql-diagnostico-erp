# Sem nota

## Pergunta de negócio

Quais registros apresentam sem nota?

## SQL

```sql
SELECT t.titulo_id FROM dbo.titulos AS t
LEFT JOIN dbo.notas AS n ON n.nota_id = t.nota_id
WHERE n.nota_id IS NULL;
```

## Resultado esperado

Para a carga versionada: titulo_id=3. O gabarito identifica `titulo_sem_nota`: `{"titulo_id": 3}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta na triagem de sem nota, antes de investigar e corrigir a origem dos dados.
