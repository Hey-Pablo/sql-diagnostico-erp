-- Índices adicionais para consultas de diagnóstico. As chaves já criam seus índices.
CREATE INDEX IX_notas_cliente ON dbo.notas(cliente_id) INCLUDE (nota_id, total);
CREATE INDEX IX_nota_itens_produto ON dbo.nota_itens(produto_id);
CREATE INDEX IX_titulos_vencimento ON dbo.titulos(data_vencimento) INCLUDE (cliente_id, valor, data_pagamento);
CREATE INDEX IX_titulos_documento ON dbo.titulos(cliente_id, numero_documento, parcela);
CREATE INDEX IX_estoque_produto_data ON dbo.estoque_movimentos(produto_id, data_movimento) INCLUDE (quantidade);
CREATE INDEX IX_clientes_cnpj ON dbo.clientes(cnpj);
CREATE INDEX IX_pedidos_cliente ON dbo.pedidos(cliente_id);
CREATE INDEX IX_pedido_itens_produto ON dbo.pedido_itens(produto_id);
