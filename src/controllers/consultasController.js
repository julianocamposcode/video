import { ConsultasService } from "../services/consultasService.js";


export async function postConsulta(req, res) {
    const { assistida_id, data_consulta, hora_consulta, medico, especialidade, observacoes, status } = req.body;
    const created = await ConsultasService.createConsulta({ assistida_id, data_consulta, hora_consulta, medico, especialidade, observacoes, status })
    res.status(201).json(created)
}