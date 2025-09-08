import { AssistidaService } from "../services/assistidaService.js";


export async function getAssistidas(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const result = await AssistidaService.findAllAssistidas({ page, limit })
    res.json(result)
}

export async function getAssistida(req, res) {
    const {id} = req.params;
    const result = await AssistidaService.findAssistidaWhichConsultas(id)
    res.json(result)
}

export async function getAssistidaDetalhes(req, res) {
    try {
        const { id } = req.params;
        const assistida = await AssistidaService.getAssistidaDetalhes(id);
        res.json(assistida);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}