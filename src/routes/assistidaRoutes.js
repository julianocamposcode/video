import { Router } from "express";
import { getAssistidas, getAssistidaDetalhes } from "../controllers/assistidaController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.get('/', authenticate, authorize('admin'), getAssistidas);

router.get('/:id', authenticate, authorize('user'),getAssistidaDetalhes);



export default router;
