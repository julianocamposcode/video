import { Router } from "express";
import { postConsulta } from "../controllers/consultasController.js";

const router = Router();

router.post('/', postConsulta)


export default router;