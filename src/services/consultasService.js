import * as consultasRepo from '../repositories/consultasRepo.js';
import * as assistidaRepo from '../repositories/assistidaRepo.js';

export class ConsultasService {

  static async createConsulta({ assistida_id, data_consulta, hora_consulta, medico, especialidade = null, observacoes = null, status = 'agendada' }) {
    
    const assistidaId = parseInt(assistida_id);
    if (!assistidaId || assistidaId <= 0) {
      const error = new Error('ID da assistida deve ser um número válido');
      error.status = 400;
      throw error;
    }

    // Verifica se a assistida existe
    const assistida = await assistidaRepo.findAssistidaById(assistidaId);
    if (!assistida) {
      const error = new Error('Assistida não encontrada');
      error.status = 404;
      throw error;
    }

    // Validação básica da data/hora
    if (!data_consulta || !hora_consulta) {
      const error = new Error('Data e hora da consulta são obrigatórias');
      error.status = 400;
      throw error;
    }

    if (!medico) {
      const error = new Error('O nome do médico é obrigatório');
      error.status = 400;
      throw error;
    }

    // Cria a consulta no repositório
    return await consultasRepo.createConsulta({
      assistida_id: assistidaId,
      data_consulta,
      hora_consulta,
      medico,
      especialidade,
      observacoes,
      status
    });
  }

  // Buscar consultas por assistida
  static async findConsultasByAssistida(assistidaId) {
    const id = parseInt(assistidaId);
    if (!id || id <= 0) {
      const error = new Error('ID da assistida deve ser um número válido');
      error.status = 400;
      throw error;
    }

    return await consultasRepo.findConsultasByAssistidaId(id);
  }

  // Atualizar status de uma consulta
  static async updateStatusConsulta(consultaId, status) {
    const id = parseInt(consultaId);
    if (!id || id <= 0) {
      const error = new Error('ID da consulta deve ser um número válido');
      error.status = 400;
      throw error;
    }

    const allowedStatuses = ['agendada', 'realizada', 'cancelada'];
    if (!allowedStatuses.includes(status)) {
      const error = new Error(`Status inválido. Valores permitidos: ${allowedStatuses.join(', ')}`);
      error.status = 400;
      throw error;
    }

    return await consultasRepo.updateStatusConsulta(id, status);
  }

}
