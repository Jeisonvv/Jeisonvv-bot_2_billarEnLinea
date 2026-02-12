// Este archivo define el flujo para rifas.
// Responde a los usuarios que preguntan por sorteos o rifas.

export const rafflesFlow = async (client, msg) => {
  await client.sendMessage(msg.from, "🎲 Participa en nuestras rifas. ¡Pregunta por la próxima!");
};