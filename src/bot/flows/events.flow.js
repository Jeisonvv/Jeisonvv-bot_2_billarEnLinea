// Este archivo define el flujo para eventos.
import { registerUserInteraction } from "../../services/user.service.js";
// Responde a los usuarios que preguntan por torneos, eventos o actividades especiales.

export const eventsFlow = async (client, msg) => {
  await registerUserInteraction({
    phone: msg.from,
    interestType: "EVENTS",
    statusUpdate: "INTERESTED",
  });

  await client.sendMessage(
    msg.from,
    "🎉 Próximos eventos: Torneos, rifas y más. ¡Mantente atento!"
  );
};