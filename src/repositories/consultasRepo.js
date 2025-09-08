import pool from "../config/db.js";

// Criar uma consulta
export async function createConsulta({ assistida_id, data_consulta, hora_consulta, medico, especialidade = null, observacoes = null, status = 'agendada' }) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO consultas 
      (assistida_id, data_consulta, hora_consulta, medico, especialidade, observacoes, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [assistida_id, data_consulta, hora_consulta, medico, especialidade, observacoes, status]
    );

    const consultaId = result.insertId;

    const [consultaRows] = await conn.query(`SELECT * FROM consultas WHERE id = ?`, [consultaId]);
    const consulta = consultaRows[0];

    await conn.commit();
    return consulta;

  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

// Buscar consultas por assistida
export async function findConsultasByAssistidaId(assistidaId) {
  const [rows] = await pool.query(
    `SELECT * FROM consultas WHERE assistida_id = ? ORDER BY data_consulta DESC, hora_consulta DESC`,
    [assistidaId]
  );

  return rows;
}

// Atualizar status de uma consulta
export async function updateStatusConsulta(consultaId, status) {
  const [result] = await pool.query(
    `UPDATE consultas SET status = ?, data_atualizacao = CURRENT_TIMESTAMP WHERE id = ?`,
    [status, consultaId]
  );

  return result.affectedRows > 0;
}

// Buscar consulta por ID
export async function findConsultaById(consultaId) {
  const [rows] = await pool.query(`SELECT * FROM consultas WHERE id = ?`, [consultaId]);
  return rows.length > 0 ? rows[0] : null;
}
