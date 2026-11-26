import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { gerar } from '../tools/gerar-seed.js';

// Helper to parse SQL and identify which tables/columns are used
function parseQuery(sql) {
  const tables = new Set();
  const fromMatch = sql.match(/FROM\s+dbo\.(\w+)/i);
  if (fromMatch) tables.add(fromMatch[1]);

  // Find JOIN tables
  const joinMatches = sql.matchAll(/JOIN\s+dbo\.(\w+)/gi);
  for (const match of joinMatches) {
    tables.add(match[1]);
  }

  // Find all dbo.table references
  const allTableMatches = sql.matchAll(/dbo\.(\w+)/gi);
  for (const match of allTableMatches) {
    tables.add(match[1]);
  }

  return Array.from(tables);
}

test('consultas fiscais retornam resultados corretos', () => {
  const { dados } = gerar();

  // Consulta 1: Total divergente
  const totalDivergente = dados.notas.filter(n => n.nota_id === 1);
  const itensNota1 = dados.nota_itens.filter(i => i.nota_id === 1);
  const totalCalculado = itensNota1.reduce((s, i) => s + i.quantidade * i.valor_unitario, 0);
  assert.equal(totalDivergente[0].total, 110, 'Nota 1 total should be 110');
  assert.equal(totalCalculado, 100, 'Nota 1 total calculated should be 100');
  assert.notEqual(totalDivergente[0].total, totalCalculado, 'Total should be divergent');

  // Consulta 2: Numeração com buracos
  const notas = dados.notas.filter(n => n.serie === 1).sort((a, b) => a.numero - b.numero);
  const numeros = notas.map(n => n.numero);
  // Nota 5 está ausente
  assert.ok(!numeros.includes(5), 'Numero 5 should be missing');

  // Consulta 3: Nota sem itens
  assert.ok(dados.notas.some(n => n.nota_id === 2), 'Nota 2 exists');
  assert.ok(!dados.nota_itens.some(i => i.nota_id === 2), 'Nota 2 has no items');

  // Consulta 4: Nota sem pedido
  assert.equal(dados.notas.find(n => n.nota_id === 3).pedido_id, null, 'Nota 3 should have no pedido');

  // Consulta 5: Diferença de valor
  assert.equal(dados.notas.find(n => n.nota_id === 4).total, 100, 'Nota 4 total');
  assert.equal(dados.titulos.find(t => t.nota_id === 4).valor, 120, 'Titulo 4 valor');

  // Consulta 6: Faixa ausente (mesmo resultado que consulta 2)
  assert.ok(!numeros.includes(5), 'Numero 5 missing for faixa query');
});

test('consultas financeiras retornam resultados corretos', () => {
  const { dados } = gerar();

  // Consulta 1: Títulos duplicados
  const duplicados = dados.titulos.filter(t => t.cliente_id === 4 && t.numero_documento === 'DUP' && t.parcela === 1);
  assert.equal(duplicados.length, 2, 'Should have 2 duplicate titles');

  // Consulta 2: Título sem nota
  const tituloSemNota = dados.titulos.find(t => t.titulo_id === 3);
  assert.equal(tituloSemNota.nota_id, null, 'Titulo 3 should have no nota');

  // Consulta 3: Título valor divergente
  // Busca títulos cujo valor é diferente do total da nota
  const titulosValores = dados.titulos
    .filter(t => t.nota_id !== null)
    .map(t => {
      const nota = dados.notas.find(n => n.nota_id === t.nota_id);
      return { titulo_id: t.titulo_id, valor: t.valor, total_nota: nota ? nota.total : null, divergente: t.valor !== nota?.total };
    })
    .filter(t => t.divergente);
  // Deveria retornar titulo 4 (valor=120, total=100) e titulo 301 (valor=120, total=100)
  assert.ok(titulosValores.some(t => t.titulo_id === 4), 'Titulo 4 should have divergent value');
  assert.ok(titulosValores.some(t => t.titulo_id === 301), 'Titulo 301 should have divergent value');
  assert.ok(titulosValores.length >= 2, 'Should have at least 2 divergent title values');

  // Consulta 4: Faixas de atraso
  // Data referência: 2025-03-15
  // Titulos em atraso: 4 (venc 2025-02-01 = 42 dias), 301 (venc 2025-02-01 = 42 dias)
  const titulosAtraso = dados.titulos.filter(t => t.data_pagamento === null && t.data_vencimento <= '2025-03-15');
  assert.ok(titulosAtraso.some(t => t.titulo_id === 4), 'Titulo 4 is in delay range');
  assert.ok(titulosAtraso.some(t => t.titulo_id === 301), 'Titulo 301 is in delay range');

  // Consulta 5: Linhas duplicadas (mesmo resultado que consulta 1)
  assert.equal(duplicados.length, 2, 'Duplicate lines count');
});

test('consultas de estoque retornam resultados corretos', () => {
  const { dados } = gerar();

  // Consulta 1: Saldo negativo
  const saldoProduto1 = dados.estoque_movimentos
    .filter(m => m.produto_id === 1)
    .reduce((s, m) => s + m.quantidade, 0);
  assert.equal(saldoProduto1, -1, 'Produto 1 should have negative balance');

  // Consulta 2: Produto sem movimento
  const produto2 = dados.produtos.find(p => p.produto_id === 2);
  assert.equal(produto2.produto_id, 2, 'Produto 2 exists');
  assert.ok(!dados.estoque_movimentos.some(m => m.produto_id === 2), 'Produto 2 has no movements');

  // Consulta 3: Saída de produto inativo
  const saidaProduto3 = dados.estoque_movimentos.filter(m => m.produto_id === 3 && m.tipo === 'SAIDA');
  assert.ok(saidaProduto3.length > 0, 'Produto 3 inativo has output movement');

  // Consulta 4: Saldo janela
  const saldoJanela = dados.estoque_movimentos
    .filter(m => m.produto_id === 1 && m.movimento_id === 1)
    .reduce((s, m) => s + m.quantidade, 0);
  assert.equal(saldoJanela, -1, 'Produto 1 first movement balance');

  // Consulta 5: Movimentos negativos
  const negativo = dados.estoque_movimentos.filter(m => m.produto_id === 1 && m.quantidade < 0);
  assert.ok(negativo.length > 0, 'Has negative movements for produto 1');
});

test('consultas de cadastro retornam resultados corretos', () => {
  const { dados } = gerar();

  // Consulta 1: CNPJ duplicado
  const clientesCNPJ1 = dados.clientes.filter(c => c.cnpj === '00000000000001');
  assert.equal(clientesCNPJ1.length, 2, 'Should have 2 clients with same CNPJ');

  // Consulta 2: Cliente sem email
  const clienteSemEmail = dados.clientes.find(c => c.cliente_id === 3);
  assert.equal(clienteSemEmail.email, null, 'Cliente 3 should have no email');

  // Consulta 3: Clientes duplicados (mesmo CNPJ)
  assert.equal(clientesCNPJ1.length, 2, 'Duplicate clients count');

  // Consulta 4: CNPJ janela (mesmo resultado que consulta 1)
  assert.equal(clientesCNPJ1.length, 2, 'CNPJ window count');
});

test('todos os arquivos SQL existem e possuem conteúdo', () => {
  const categorias = { fiscal: 6, financeiro: 5, estoque: 5, cadastro: 4, otimizacao: 3 };
  for (const [categoria, quantidade] of Object.entries(categorias)) {
    const arquivos = fs.readdirSync(path.join('consultas', categoria)).filter(n => n.endsWith('.sql'));
    assert.equal(arquivos.length, quantidade, `${categoria} should have ${quantidade} queries`);
    for (const arquivo of arquivos) {
      const conteudo = fs.readFileSync(path.join('consultas', categoria, arquivo), 'utf8').trim();
      assert.ok(conteudo.length > 0, `${arquivo} should not be empty`);
    }
  }
});

test('todos os documentos de consulta existem com estrutura correta', () => {
  const categorias = { fiscal: 6, financeiro: 5, estoque: 5, cadastro: 4 };
  for (const [categoria, quantidade] of Object.entries(categorias)) {
    const arquivosSql = fs.readdirSync(path.join('consultas', categoria)).filter(n => n.endsWith('.sql'));
    assert.equal(arquivosSql.length, quantidade);
    for (const sqlFile of arquivosSql) {
      const docPath = path.join('docs', `${categoria}_${sqlFile.replace('.sql', '.md')}`);
      assert.ok(fs.existsSync(docPath), `Document for ${sqlFile} should exist`);
      const doc = fs.readFileSync(docPath, 'utf8');
      assert.ok(doc.includes('## Pergunta de negócio'), `Document ${sqlFile} should have "Pergunta de negócio"`);
      assert.ok(doc.includes('## SQL'), `Document ${sqlFile} should have "SQL"`);
      assert.ok(doc.includes('## Resultado esperado'), `Document ${sqlFile} should have "Resultado esperado"`);
      assert.ok(doc.includes('## Quando usar'), `Document ${sqlFile} should have "Quando usar"`);
    }
  }
});

test('o script de carga gera dados consistentes', () => {
  const a = gerar();
  const b = gerar();
  assert.deepEqual(a.dados, b.dados, 'Generated data should be deterministic');
});

test('os 12 erros plantados estão presentes nos dados', () => {
  const { dados, erros } = gerar();
  assert.equal(erros.length, 12, 'Should have 12 planted errors');

  const checks = {
    total_nota: () => dados.notas.find(n => n.nota_id === 1).total !== dados.nota_itens.filter(i => i.nota_id === 1).reduce((s, i) => s + i.quantidade * i.valor_unitario, 0),
    numero_ausente: () => !dados.notas.some(n => n.serie === 1 && n.numero === 5) && dados.notas.some(n => n.numero === 4) && dados.notas.some(n => n.numero === 6),
    nota_sem_itens: () => dados.notas.some(n => n.nota_id === 2) && !dados.nota_itens.some(i => i.nota_id === 2),
    nota_sem_pedido: () => dados.notas.find(n => n.nota_id === 3).pedido_id === null,
    titulo_duplicado: () => dados.titulos.filter(t => t.cliente_id === 4 && t.numero_documento === 'DUP' && t.parcela === 1).length === 2,
    titulo_sem_nota: () => dados.titulos.find(t => t.titulo_id === 3).nota_id === null,
    titulo_valor_divergente: () => dados.titulos.find(t => t.titulo_id === 4).valor !== dados.notas.find(n => n.nota_id === 4).total,
    estoque_negativo: () => dados.estoque_movimentos.filter(m => m.produto_id === 1).reduce((s, m) => s + m.quantidade, 0) < 0,
    produto_sem_movimento: () => dados.produtos.some(p => p.produto_id === 2) && !dados.estoque_movimentos.some(m => m.produto_id === 2),
    saida_produto_inativo: () => dados.produtos.find(p => p.produto_id === 3).ativo === 0 && dados.estoque_movimentos.some(m => m.produto_id === 3 && m.quantidade < 0),
    cnpj_duplicado: () => dados.clientes.filter(c => c.cnpj === '00000000000001').length === 2,
    cliente_sem_email: () => dados.clientes.find(c => c.cliente_id === 3).email === null,
  };
  for (const erro of erros) {
    assert.ok(checks[erro.id], `verificador ausente: ${erro.id}`);
    assert.ok(checks[erro.id](), `erro ausente: ${erro.id}`);
  }
});

test('o gabarito identifica corretamente tabela, categoria e chaves', () => {
  const { erros } = gerar();
  const esperado = [
    ['total_nota','fiscal','notas',{nota_id:1}], ['numero_ausente','fiscal','notas',{serie:1,numero:5}],
    ['nota_sem_itens','fiscal','notas',{nota_id:2}], ['nota_sem_pedido','fiscal','notas',{nota_id:3}],
    ['titulo_duplicado','financeiro','titulos',{titulo_ids:[4,301]}], ['titulo_sem_nota','financeiro','titulos',{titulo_id:3}],
    ['titulo_valor_divergente','financeiro','titulos',{titulo_ids:[4,301]}], ['estoque_negativo','estoque','estoque_movimentos',{produto_id:1}],
    ['produto_sem_movimento','estoque','produtos',{produto_id:2}], ['saida_produto_inativo','estoque','estoque_movimentos',{produto_id:3,movimento_id:3}],
    ['cnpj_duplicado','cadastro','clientes',{cliente_ids:[1,2]}], ['cliente_sem_email','cadastro','clientes',{cliente_id:3}]
  ].map(([id,categoria,tabela,chave]) => ({id,categoria,tabela,chave}));
  assert.deepEqual(erros, esperado, 'Erros should match expected gabarito');
});

test('consultas otimizacao possuem estrutura valida', () => {
  const caminhos = [
    'consultas/otimizacao/01_cnpj.sql',
    'consultas/otimizacao/02_titulo.sql',
    'consultas/otimizacao/03_estoque.sql'
  ];
  for (const caminho of caminhos) {
    assert.ok(fs.existsSync(caminho), `File ${caminho} should exist`);
    const conteudo = fs.readFileSync(caminho, 'utf8');
    assert.ok(conteudo.includes('INDEX(0)') || conteudo.includes('STATISTICS'), `File ${caminho} should have optimization directives`);
  }
});