# Sem movimento

## Pergunta de negócio

Quais registros apresentam sem movimento?

## SQL

```sql
SELECT p.produto_id FROM dbo.produtos AS p
LEFT JOIN dbo.estoque_movimentos AS m ON m.produto_id = p.produto_id
WHERE m.movimento_id IS NULL;
```

## Resultado esperado

Para a carga versionada: produto_id=2. O gabarito identifica `produto_sem_movimento`: `{"produto_id": 2}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta na triagem de sem movimento, antes de investigar e corrigir a origem dos dados.
