# Saídas de produtos inativos

## Pergunta de negócio

Lançar saída de estoque para um produto inativo indica cadastro inconsistente ou erro de operação. Quais movimentos de saída referenciam produtos que não estão mais ativos?

## SQL

```sql
SELECT m.movimento_id, m.produto_id FROM dbo.estoque_movimentos AS m
JOIN dbo.produtos AS p ON p.produto_id = m.produto_id
WHERE p.ativo = 0 AND m.tipo = 'SAIDA';
```

## Resultado esperado

Para a carga versionada: movimento_id=3, produto_id=3. O gabarito identifica `saida_produto_inativo`: `{"produto_id": 3, "movimento_id": 3}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta após a desativação de produtos, para identificar movimentações pendentes, ou quando há divergência entre histórico e situação atual dos produtos.