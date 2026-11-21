# Produtos sem movimento

## Pergunta de negócio

Produtos sem nenhum registro de movimento no estoque indicam necessidade de revisão: podem ser itens obsoletos, duplicados ou sem ser vendidos. Quais produtos nunca tiveram entrada ou saída registrada?

## SQL

```sql
SELECT p.produto_id FROM dbo.produtos AS p
LEFT JOIN dbo.estoque_movimentos AS m ON m.produto_id = p.produto_id
WHERE m.movimento_id IS NULL;
```

## Resultado esperado

Para a carga versionada: produto_id=2. O gabarito identifica `produto_sem_movimento`: `{"produto_id": 2}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta no inventário periódico, para cleanup de produtos órfãos, ou ao revisar a linha de produtos ativos.