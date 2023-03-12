import config from './config.js';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import router from './components/routes/products.routes.js';
import { fileURLToPath } from 'url';
import path from 'path';

//incializa el servidor con express
const app = express();
// //middleware for handling multipart/form-data

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('port', config.PORT);
app.use(cors());

//Parsea todas las llamadas PUT y POST en formato Object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//la ubicacion public sirve los archivos estaticos que esten en storage/img
// app.use('/static', express.static(path.join(__dirname, 'src')));
app.use(router);
export default app;
