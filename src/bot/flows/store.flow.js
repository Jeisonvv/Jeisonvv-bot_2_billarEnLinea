import { setState } from "../stateManager.js"

// Este archivo define el flujo para la tienda.
// Responde a los usuarios que preguntan por productos o servicios.

export const storeFlow = async (client, msg) => {
  await client.sendMessage(msg.from, "🛒 Bienvenido a la tienda. Pregunta por productos o servicios.");
};