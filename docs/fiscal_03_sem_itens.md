# Sem itens

## Pergunta de negócio

Quais registros apresentam sem itens?

## SQL

```sql
SELECT n.nota_id FROM dbo.notas AS n
LEFT JOIN dbo.nota_itens AS i ON i.nota_id = n.nota_id
WHERE i.nota_id IS NULL;
```

## Resultado esperado

Para a carga versionada: nota_id=2. O gabarito identifica `nota_sem_itens`: `{"nota_id": 2}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta na triagem de sem itens, antes de investigar e corrigir a origem dos dados.
