-- Banco fictício para diagnóstico; execute em um banco vazio.
CREATE TABLE dbo.clientes (
    cliente_id int NOT NULL CONSTRAINT PK_clientes PRIMARY KEY,
    razao_social nvarchar(150) NOT NULL,
    cnpj char(14) NOT NULL,
    email nvarchar(254) NULL,
    ativo bit NOT NULL CONSTRAINT DF_clientes_ativo DEFAULT (1)
);
CREATE TABLE dbo.produtos (
    produto_id int NOT NULL CONSTRAINT PK_produtos PRIMARY KEY,
    sku varchar(30) NOT NULL CONSTRAINT UQ_produtos_sku UNIQUE,
    descricao nvarchar(150) NOT NULL,
    ativo bit NOT NULL CONSTRAINT DF_produtos_ativo DEFAULT (1)
);
CREATE TABLE dbo.pedidos (
    pedido_id int NOT NULL CONSTRAINT PK_pedidos PRIMARY KEY,
    cliente_id int NOT NULL CONSTRAINT FK_pedidos_clientes REFERENCES dbo.clientes(cliente_id),
    data_pedido date NOT NULL,
    status varchar(20) NOT NULL CONSTRAINT CK_pedidos_status CHECK (status IN ('ABERTO', 'FATURADO', 'CANCELADO'))
);
CREATE TABLE dbo.pedido_itens (
    pedido_id int NOT NULL CONSTRAINT FK_pedido_itens_pedidos REFERENCES dbo.pedidos(pedido_id),
    item int NOT NULL,
    produto_id int NOT NULL CONSTRAINT FK_pedido_itens_produtos REFERENCES dbo.produtos(produto_id),
    quantidade decimal(12,2) NOT NULL CONSTRAINT CK_pedido_itens_quantidade CHECK (quantidade > 0),
    valor_unitario decimal(12,2) NOT NULL CONSTRAINT CK_pedido_itens_valor CHECK (valor_unitario >= 0),
    CONSTRAINT PK_pedido_itens PRIMARY KEY (pedido_id, item)
);
CREATE TABLE dbo.notas (
    nota_id int NOT NULL CONSTRAINT PK_notas PRIMARY KEY,
    pedido_id int NULL CONSTRAINT FK_notas_pedidos REFERENCES dbo.pedidos(pedido_id),
    cliente_id int NOT NULL CONSTRAINT FK_notas_clientes REFERENCES dbo.clientes(cliente_id),
    serie int NOT NULL,
    numero int NOT NULL,
    data_emissao date NOT NULL,
    total decimal(14,2) NOT NULL CONSTRAINT CK_notas_total CHECK (total >= 0),
    CONSTRAINT UQ_notas_serie_numero UNIQUE (serie, numero)
);
CREATE TABLE dbo.nota_itens (
    nota_id int NOT NULL CONSTRAINT FK_nota_itens_notas REFERENCES dbo.notas(nota_id),
    item int NOT NULL,
    produto_id int NOT NULL CONSTRAINT FK_nota_itens_produtos REFERENCES dbo.produtos(produto_id),
    quantidade decimal(12,2) NOT NULL CONSTRAINT CK_nota_itens_quantidade CHECK (quantidade > 0),
    valor_unitario decimal(12,2) NOT NULL CONSTRAINT CK_nota_itens_valor CHECK (valor_unitario >= 0),
    CONSTRAINT PK_nota_itens PRIMARY KEY (nota_id, item)
);
CREATE TABLE dbo.titulos (
    titulo_id int NOT NULL CONSTRAINT PK_titulos PRIMARY KEY,
    nota_id int NULL CONSTRAINT FK_titulos_notas REFERENCES dbo.notas(nota_id),
    cliente_id int NOT NULL CONSTRAINT FK_titulos_clientes REFERENCES dbo.clientes(cliente_id),
    numero_documento varchar(30) NOT NULL,
    parcela int NOT NULL CONSTRAINT CK_titulos_parcela CHECK (parcela > 0),
    data_vencimento date NOT NULL,
    valor decimal(14,2) NOT NULL CONSTRAINT CK_titulos_valor CHECK (valor > 0),
    data_pagamento date NULL
);
CREATE TABLE dbo.estoque_movimentos (
    movimento_id int NOT NULL CONSTRAINT PK_estoque_movimentos PRIMARY KEY,
    produto_id int NOT NULL CONSTRAINT FK_estoque_produtos REFERENCES dbo.produtos(produto_id),
    data_movimento date NOT NULL,
    quantidade decimal(12,2) NOT NULL CONSTRAINT CK_estoque_quantidade CHECK (quantidade <> 0),
    tipo varchar(10) NOT NULL CONSTRAINT CK_estoque_tipo CHECK ((tipo = 'ENTRADA' AND quantidade > 0) OR (tipo = 'SAIDA' AND quantidade < 0))
);
