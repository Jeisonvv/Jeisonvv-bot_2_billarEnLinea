// Este archivo define el flujo para registro de torneos.
// Responde a los usuarios que quieren inscribirse en torneos.

export const tournamentRegisterFlow = async (client, msg) => {
  await client.sendMessage(msg.from, "🏆 Regístrate para el próximo torneo. ¡Solicita más información!");
};
