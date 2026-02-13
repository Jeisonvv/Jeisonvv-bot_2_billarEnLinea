import { setState } from "../stateManager.js"
import { registerUserInteraction } from "../../services/user.service.js";
import { findOrCreateUser } from "../../services/user.service.js";
import { stateTypingDelay } from "../../utils/stateTipingDelay.js";

// Este archivo define el flujo para la tienda.
// Responde a los usuarios que preguntan por productos o servicios.

export const storeFlow = async (client, msg) => {
   await stateTypingDelay(msg);
     const user = msg.from;
   
     // 1️⃣ Aseguramos que el usuario exista en DB
     const userData = await findOrCreateUser(user);
   
     // 2️⃣ Registramos que mostró interés en tienda
     await registerUserInteraction({
       whatsappId: user,
       interestType: "STORE",
       statusUpdate: "INTERESTED"
     });
  await client.sendMessage(msg.from, "🛒 Bienvenido a la tienda. Pregunta por productos o servicios.");
};