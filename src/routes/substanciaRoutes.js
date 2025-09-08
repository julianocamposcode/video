import { Router } from "express";
import { getSubstancias } from "../controllers/substanciaController.js";

const router = Router();

router.get('/', getSubstancias)


export default router;