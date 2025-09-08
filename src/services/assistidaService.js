import * as assistidaRepo from '../repositories/assistidaRepo.js';

export class AssistidaService {

    static async findAllAssistidas({ page = 1, limit = 10 } = {}) {
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.max(1, parseInt(limit) || 10);

        return await assistidaRepo.findAllAssistidas({
            page: pageNum,
            limit: limitNum
        });
    }

    static async getAssistidaDetalhes(id) {
        const assistidaId = parseInt(id);
        if (!assistidaId || assistidaId <= 0) {
            const error = new Error('ID da assistida deve ser um número válido');
            error.status = 400;
            throw error;
        }

        const assistida = await assistidaRepo.findAssistidaWithConsultasAndSubstancias(assistidaId);
        if (!assistida) {
            const error = new Error('Assistida não encontrada');
            error.status = 404;
            throw error;
        }

        return assistida;
    }
}
