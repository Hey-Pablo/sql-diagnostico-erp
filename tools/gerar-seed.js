// Dados sintéticos reproduzíveis. Não utiliza dados de pessoas ou empresas reais.

function gerar() {
  let estado = 20261121; // Semente fixa para os dados sintéticos.
  const proximo = () => { estado = (Math.imul(1664525, estado) + 1013904223) >>> 0; return estado; };
  const dados = { clientes: [], produtos: [], pedidos: [], pedido_itens: [], notas: [], nota_itens: [], titulos: [], estoque_movimentos: [] };
  for (let i = 1; i <= 300; i++) {
    dados.clientes.push({ cliente_id: i, razao_social: `Cliente ficticio ${i}`, cnpj: String(i === 2 ? 1 : i).padStart(14, '0'), email: i === 3 ? null : `cliente${i}@example.invalid`, ativo: 1 });
    dados.produtos.push({ produto_id: i, sku: `SKU${i}`, descricao: `Produto ficticio ${i} lote ${proximo() % 1000}`, ativo: i === 3 ? 0 : 1 });
    dados.pedidos.push({ pedido_id: i, cliente_id: i, data_pedido: '2025-01-01', status: 'FATURADO' });
    dados.pedido_itens.push({ pedido_id: i, item: 1, produto_id: i, quantidade: 1, valor_unitario: 100 });
    dados.notas.push({ nota_id: i, pedido_id: i === 3 ? null : i, cliente_id: i, serie: 1, numero: i >= 5 ? i + 1 : i, data_emissao: '2025-01-02', total: i === 1 ? 110 : 100 });
    if (i !== 2) dados.nota_itens.push({ nota_id: i, item: 1, produto_id: i, quantidade: 1, valor_unitario: 100 });
    dados.titulos.push({ titulo_id: i, nota_id: i === 3 ? null : i, cliente_id: i, numero_documento: i === 4 ? 'DUP' : `DOC${i}`, parcela: 1, data_vencimento: '2025-02-01', valor: i === 4 ? 120 : (i === 1 ? 110 : 100), data_pagamento: i === 4 ? null : '2025-02-01' });
    if (i !== 2) dados.estoque_movimentos.push({ movimento_id: i, produto_id: i, data_movimento: '2025-01-01', quantidade: i === 1 || i === 3 ? -1 : 10, tipo: i === 1 || i === 3 ? 'SAIDA' : 'ENTRADA' });
  }
  // Entrada compensa a saída do produto inativo; somente o produto 1 fica negativo.
  dados.estoque_movimentos.push({ movimento_id: 301, produto_id: 3, data_movimento: '2024-12-31', quantidade: 10, tipo: 'ENTRADA' });
  dados.titulos.push({ ...dados.titulos[3], titulo_id: 301 });
  const erros = [
    ['total_nota','fiscal','notas',{nota_id:1}], ['numero_ausente','fiscal','notas',{serie:1,numero:5}],
    ['nota_sem_itens','fiscal','notas',{nota_id:2}], ['nota_sem_pedido','fiscal','notas',{nota_id:3}],
    ['titulo_duplicado','financeiro','titulos',{titulo_ids:[4,301]}], ['titulo_sem_nota','financeiro','titulos',{titulo_id:3}],
    ['titulo_valor_divergente','financeiro','titulos',{titulo_ids:[4,301]}], ['estoque_negativo','estoque','estoque_movimentos',{produto_id:1}],
    ['produto_sem_movimento','estoque','produtos',{produto_id:2}], ['saida_produto_inativo','estoque','estoque_movimentos',{produto_id:3,movimento_id:3}],
    ['cnpj_duplicado','cadastro','clientes',{cliente_ids:[1,2]}], ['cliente_sem_email','cadastro','clientes',{cliente_id:3}]
  ].map(([id,categoria,tabela,chave]) => ({id,categoria,tabela,chave}));
  const valor = v => v === null ? 'NULL' : typeof v === 'number' ? String(v) : `N'${v.replaceAll("'", "''")}'`;
  let sql = '-- Gerado por tools/gerar-seed.js; execute em banco vazio. Dados fictícios.\nSET NOCOUNT ON;\n';
  for (const [tabela, linhas] of Object.entries(dados)) {
    const colunas = Object.keys(linhas[0]);
    for (let i = 0; i < linhas.length; i += 500) {
      sql += `INSERT INTO dbo.${tabela} (${colunas.join(', ')}) VALUES\n` + linhas.slice(i, i + 500).map(l => `(${colunas.map(c => valor(l[c])).join(', ')})`).join(',\n') + ';\n';
    }
  }
  return { dados, erros, sql };
}
export { gerar };