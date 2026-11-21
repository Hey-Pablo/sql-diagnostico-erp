# Saldo negativo no estoque

## Pergunta de negócio

Produtos com saldo negativo indicam mais saídas do que entradas, causando ruptura de estoque e imprescricibilidade para atender pedidos. Quais produtos possuem saldo menor que zero, indicando necessidade imediata de reposição?

## SQL

```sql
SELECT produto_id, SUM(quantidade) AS saldo FROM dbo.estoque_movimentos
GROUP BY produto_id HAVING SUM(quantidade) < 0;
```

## Resultado esperado

Para a carga versionada: produto_id=1, saldo=-1. O gabarito identifica `estoque_negativo`: `{"produto_id": 1}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta no fechamento de estoque, após o recebimento de mercadorias, ou quando há reclamações de falta de produtos em armazém.