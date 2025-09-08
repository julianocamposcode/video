import pool from "../config/db.js";


export async function insertAssistidaSubstancias(assistidaId, substancias, conn) {
  for (const substancia of substancias) {
    await conn.query(
      `
      INSERT INTO assistida_substancia 
      (assistida_id, substancia_id, data_inicio, data_fim, observacoes)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        data_inicio = VALUES(data_inicio),
        data_fim = VALUES(data_fim),
        observacoes = VALUES(observacoes),
        updatedAt = CURRENT_TIMESTAMP
      `,
      [
        assistidaId,
        substancia.substancia_id,
        substancia.data_inicio || null,
        substancia.data_fim || null,
        substancia.observacoes || null,
      ]
    );
  }
}

// Buscar substâncias de uma assistida
export async function findSubstanciasByAssistidaId(assistidaId) {
  const [rows] = await pool.query(
    `
    SELECT 
      asub.id,
      asub.data_inicio,
      asub.data_fim,
      asub.observacoes,
      s.id AS substancia_id,
      s.nome AS substancia_nome,
      s.categoria,
      s.descricao
    FROM assistida_substancia asub
    JOIN substancias s ON asub.substancia_id = s.id
    WHERE asub.assistida_id = ?
    ORDER BY asub.data_inicio DESC
    `,
    [assistidaId]
  );

  return rows;
}


export async function deleteAssistidaSubstancia(assistidaId, substanciaId, conn = pool) {
  await conn.query(
    `DELETE FROM assistida_substancia WHERE assistida_id = ? AND substancia_id = ?`,
    [assistidaId, substanciaId]
  );
}
