# Sem email

## Pergunta de negócio

Quais registros apresentam sem email?

## SQL

```sql
SELECT cliente_id FROM dbo.clientes WHERE email IS NULL OR LTRIM(RTRIM(email)) = '';
```

## Resultado esperado

Para a carga versionada: cliente_id=3. O gabarito identifica `cliente_sem_email`: `{"cliente_id": 3}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta na triagem de sem email, antes de investigar e corrigir a origem dos dados.
