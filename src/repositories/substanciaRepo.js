import pool from "../config/db.js";

export async function findAllSubstancias({ page = 1, limit = 10 }) {
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT id, nome, categoria, descricao, createdAt, updatedAt
     FROM substancias
     ORDER BY id
     LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );

  const [[{ total }]] = await pool.query(
    "SELECT COUNT(*) as total FROM substancias"
  );

  return {
    data: rows,
    page: Number(page),
    limit: Number(limit),
    total: Number(total),
  };
}


export async function findSubstanciasByIds(ids) {
  if (!ids || ids.length === 0) return [];

  const placeholders = ids.map(() => "?").join(",");
  const [rows] = await pool.query(
    `SELECT id, nome, categoria, descricao
     FROM substancias
     WHERE id IN (${placeholders})`,
    ids
  );

  return rows;
}


export async function updateSubstancias(substancias, conn = null) {
  const connection = conn || pool;

  for (const substancia of substancias) {
    await connection.query(
      `UPDATE substancias
       SET categoria = ?, descricao = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [substancia.categoria, substancia.descricao, substancia.id]
    );
  }
}
