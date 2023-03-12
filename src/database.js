import config from './config.js';
import mongoose from 'mongoose';

export async function connectDB() {
  try {
    //inicializa conexion con base de datos
    await mongoose.connect(
      `mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_DATABASE}.zhen7yf.mongodb.net/?retryWrites=true&w=majority`
    );
  } catch (e) {
    console.log(e);
  }
}
