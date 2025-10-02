// app.js
import express from 'express';
import cors from 'cors'; // Importa el paquete cors
import router from './routes/index.js'; // Asegúrate de que la ruta es correcta

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', router);

export default app;