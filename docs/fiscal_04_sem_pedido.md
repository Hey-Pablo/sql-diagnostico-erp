# Sem pedido

## Pergunta de negócio

Quais registros apresentam sem pedido?

## SQL

```sql
SELECT n.nota_id FROM dbo.notas AS n
LEFT JOIN dbo.pedidos AS p ON p.pedido_id = n.pedido_id
WHERE p.pedido_id IS NULL;
```

## Resultado esperado

Para a carga versionada: nota_id=3. O gabarito identifica `nota_sem_pedido`: `{"nota_id": 3}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta na triagem de sem pedido, antes de investigar e corrigir a origem dos dados.
