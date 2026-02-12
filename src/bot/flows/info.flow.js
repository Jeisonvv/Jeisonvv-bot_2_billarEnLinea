// Este archivo define el flujo para información general.
// Responde a los usuarios que preguntan por ubicación, horarios, etc.

export const infoFlow = async (client, msg) => {
  await client.sendMessage(msg.from,
    "📍 Estamos ubicados en Bogotá.\n🕒 Horarios: 10am - 10pm\n🎱 Somos especialistas en tres bandas.");
};