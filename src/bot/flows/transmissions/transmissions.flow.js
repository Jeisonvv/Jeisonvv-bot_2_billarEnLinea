import { setState } from "../../stateManager.js";
import { registerUserInteraction } from "../../../services/user.service.js";
import { findOrCreateUser, upDateName } from "../../../services/user.service.js";

export const transmissionsFlow = async (client, msg) => {
  const user = msg.from;

  // 1️⃣ Aseguramos que el usuario exista en DB
  await findOrCreateUser(user);
  

  // 2️⃣ Registramos que mostró interés en transmisiones
  await registerUserInteraction({
    phone: user,
    interestType: "TRANSMISSION",
    statusUpdate: "INTERESTED"
  });

  // 3️⃣ Guardamos el estado en MongoDB
  await setState(user, "TRANSMISSION_INITIAL");

  // 4️⃣ Enviamos el mensaje
  return client.sendMessage(
    user,
    "🏆 *Transmisión de torneos*\n\nAntes de continuar, ¿con quién tengo el gusto? \n"
  );
};
