import app from './src/app.js';
import { connectDB } from './src/database.js';
import config from './src/config.js';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const main = async () => {
  try {
    await connectDB();
    app.listen(config.PORT);
  } catch (e) {
    console.log(e);
  }
};

app.use(express.static(path.join(__dirname, 'src')));

main();
