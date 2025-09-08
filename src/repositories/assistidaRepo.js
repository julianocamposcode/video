import pool from "../config/db.js";


export async function findAllAssistidas({ page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `SELECT id, nome, cpf, rg, idade, data_nascimento, nacionalidade,
            estado_civil, profissao, escolaridade, status, createdAt, updatedAt
     FROM assistidas
     ORDER BY id
     LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM assistidas`);

  return { data: rows, page: Number(page), limit: Number(limit), total: Number(total) };
}


export async function findAssistidaById(id) {
  const [rows] = await pool.query(
    `SELECT id, nome, cpf, rg, idade, data_nascimento, nacionalidade,
            estado_civil, profissao, escolaridade, status, createdAt, updatedAt
     FROM assistidas
     WHERE id = ?`,
    [id]
  );

  return rows.length > 0 ? rows[0] : null;
}


export async function findAssistidaWithConsultasAndSubstancias(id) {
  // Buscar consultas
  const [consultaRows] = await pool.query(`
    SELECT 
      c.id AS consulta_id, c.data_consulta, c.hora_consulta, c.medico,
      c.especialidade, c.observacoes, c.status AS consulta_status,
      c.data_cadastro AS consulta_data_cadastro, c.data_atualizacao AS consulta_data_atualizacao
    FROM consultas c
    WHERE c.assistida_id = ?`,
    [id]
  );

  // Buscar substâncias
  const [substanciaRows] = await pool.query(`
    SELECT s.id, s.nome, s.categoria, s.descricao,
           a_sub.data_inicio, a_sub.data_fim, a_sub.observacoes
    FROM assistida_substancia a_sub
    JOIN substancias s ON s.id = a_sub.substancia_id
    WHERE a_sub.assistida_id = ?`,
    [id]
  );

  // Buscar dados da assistida
  const assistida = await findAssistidaById(id);
  if (!assistida) return null;

  // Mapear consultas
  assistida.consultas = consultaRows.map(row => ({
    id: row.consulta_id,
    assistida_id: id,
    data_consulta: row.data_consulta,
    hora_consulta: row.hora_consulta,
    medico: row.medico,
    especialidade: row.especialidade,
    observacoes: row.observacoes,
    status: row.consulta_status,
    criado_em: row.consulta_data_cadastro,
    atualizado_em: row.consulta_data_atualizacao
  }));

  // Mapear substâncias
  assistida.substancias = substanciaRows.map(row => ({
    id: row.id,
    nome: row.nome,
    categoria: row.categoria,
    descricao: row.descricao,
    data_inicio: row.data_inicio,
    data_fim: row.data_fim,
    observacoes: row.observacoes
  }));

  return assistida;
}
