import express from 'express';

import assistidaRoutes from './routes/assistidaRoutes.js';
import consultasRoutes from './routes/consultasRoutes.js';
import substanciasRoutes from './routes/substanciaRoutes.js';
import authRoutes from './routes/authRoutes.js';     

import 'dotenv/config';

const app = express()

app.use(express.json());

app.use('/auth', authRoutes)
app.use('/assistidas', assistidaRoutes)
app.use('/consultas', consultasRoutes)
app.use('/substancias', substanciasRoutes)

export default app;