// Importa mongoose para manejar la conexión con MongoDB
import mongoose from 'mongoose';


export const connectDB = async () => {
  try {
    // Conecta a MongoDB usando la URI del archivo .env y el nombre de la base de datos
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "billarBot_dev"
    });

    // Mensaje de éxito en la conexión
    console.log("✅ MongoDB conectado correctamente");
  } catch (error) {
    // Si hay un error, lo muestra y termina el proceso
    console.error("❌ Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
};
