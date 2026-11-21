# Notas sem pedido

## Pergunta de negócio

Notas emitidas sem pedido de venda vinculado indicam falha na integração com o módulo de pedidos ou nota aberta manualmente. Quais notas não possuem pedido relacionado?

## SQL

```sql
SELECT n.nota_id FROM dbo.notas AS n
LEFT JOIN dbo.pedidos AS p ON p.pedido_id = n.pedido_id
WHERE p.pedido_id IS NULL;
```

## Resultado esperado

Para a carga versionada: nota_id=3. O gabarito identifica `nota_sem_pedido`: `{"nota_id": 3}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta antes do envio ao SPED, ao gerar relatório de fiscalização, ou quando há pendência de lançamento contábil.