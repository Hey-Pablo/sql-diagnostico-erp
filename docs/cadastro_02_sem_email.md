# Clientes sem e-mail

## Pergunta de negócio

O envio automático de boletos, notas e comunicados falha quando o campo de e-mail está vazio ou com espaços em branco. Quais clientes não possuem e-mail válido cadastrado para envio de informações?

## SQL

```sql
SELECT cliente_id FROM dbo.clientes WHERE email IS NULL OR LTRIM(RTRIM(email)) = '';
```

## Resultado esperado

Para a carga versionada: cliente_id=3. O gabarito identifica `cliente_sem_email`: `{"cliente_id": 3}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta antes do envio de campanhas de cobrança, durante a limpeza de base de clientes, ou ao tratar reclamações de clientes que não receberam documentos.