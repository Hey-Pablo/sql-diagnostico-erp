# Saida inativo

## Pergunta de negócio

Quais registros apresentam saida inativo?

## SQL

```sql
SELECT m.movimento_id, m.produto_id FROM dbo.estoque_movimentos AS m
JOIN dbo.produtos AS p ON p.produto_id = m.produto_id
WHERE p.ativo = 0 AND m.tipo = 'SAIDA';
```

## Resultado esperado

Para a carga versionada: movimento_id=3, produto_id=3. O gabarito identifica `saida_produto_inativo`: `{"produto_id": 3, "movimento_id": 3}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta na triagem de saida inativo, antes de investigar e corrigir a origem dos dados.
