import * as substanciaRepo from '../repositories/substanciaRepo.js';

export class SubstanciaService {

  
  static async findAllSubstancias({ page = 1, limit = 10 } = {}) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 10);

    return await substanciaRepo.findAllSubstancias({
      page: pageNum,
      limit: limitNum
    });
  }

  
  static async validarSubstanciasParaAssistida(substancias) {
    const substanciaIds = substancias.map(s => s.substancia_id);
    const substanciasDb = await substanciaRepo.findSubstanciasByIds(substanciaIds);

    if (substanciasDb.length !== substancias.length) {
      const error = new Error('Uma ou mais substâncias não foram encontradas');
      error.status = 404;
      throw error;
    }

    const substanciasValidadas = [];
    for (const item of substancias) {
      const substanciaDb = substanciasDb.find(s => s.id === item.substancia_id);

      substanciasValidadas.push({
        id: substanciaDb.id,
        nome: substanciaDb.nome,
        categoria: substanciaDb.categoria,
        descricao: substanciaDb.descricao,
        data_inicio: item.data_inicio || null,
        data_fim: item.data_fim || null,
        observacoes: item.observacoes || null
      });
    }

    return substanciasValidadas;
  }

  
  static async updateSubstancias(substancias) {
    if (!Array.isArray(substancias) || substancias.length === 0) {
      const error = new Error('É necessário fornecer um array de substâncias para atualização');
      error.status = 400;
      throw error;
    }

    const results = [];
    for (const subst of substancias) {
      if (!subst.id) {
        const error = new Error('Cada substância precisa ter um ID para ser atualizada');
        error.status = 400;
        throw error;
      }

      const updated = await substanciaRepo.updateSubstancias(subst);
      results.push(updated);
    }

    return results;
  }

}
