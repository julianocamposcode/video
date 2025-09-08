import { SubstanciaService } from "../services/substanciaService.js";

export async function getSubstancias(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await SubstanciaService.findAllSubstancias({ page, limit });
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message,
    });
  }
}

export async function getSubstanciasByIds(req, res) {
  try {
    const { ids } = req.body; // espera um array de IDs no body
    const result = await SubstanciaService.findSubstanciasByIds(ids);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message,
    });
  }
}

export async function updateSubstancias(req, res) {
  try {
    const { substancias } = req.body; // espera [{id, categoria, descricao}, ...]
    const result = await SubstanciaService.updateSubstancias(substancias);
    res.json({
      message: "Substâncias atualizadas com sucesso",
      result,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message,
    });
  }
}
