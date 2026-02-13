
import {
  setState,
  getStateData,
  setStateData,
  clearStateData,
} from "../../stateManager.js";
import {
  upDateName,
  findOrCreateUser,
  updateUserPhoneAndName,
} from "../../../services/user.service.js";
import { finalizarLeadTransmision } from "../../../utils/finalizarLeadTransmision.js";

export const handleTransmissionSteps = async (client, msg, state, userData) => {
  const user = msg.from;
  const text = msg.body?.trim();
  const lowerText = text?.toLowerCase();

  // 🔴 Salir del flujo
  if (["menu", "menú", "salir", "cancelar", "inicio"].includes(lowerText)) {
    clearStateData(user);
    await setState(user, "IDLE");

    return client.sendMessage(
      user,
      "Volvemos al inicio 🎱\n\n" +
        "🛒 Tienda\n" +
        "🏆 Transmisiones\n" +
        "🎯 Eventos\n" +
        "🎁 Sorteos\n",
    );
  }

  const stateData = (await getStateData(user)) || {};

  const stateHandlers = {
    TRANSMISSION_INITIAL: async () => {
      if (userData.name && userData.name.trim().length > 1) {
        stateData.contactName = userData.name;
        setStateData(user, stateData);
        await setState(user, "TRANSMISSION_CITY");
        return client.sendMessage(
          user,
          `Perfecto 🙌\n🏢 ¿Cómo se llama el billar?\n\nRecuerda que puedes escribir *"menu" o "cancelar"* en cualquier momento para volver al inicio.`,
        );
      }
      console.log("[DEBUG] Usuario sin nombre, guardando nombre:", text);
      const updatedUser = await upDateName(user, text);
      stateData.contactName = updatedUser.name;
      setStateData(user, stateData);
      await setState(user, "TRANSMISSION_CITY");
      return client.sendMessage(
        user,
        `Perfecto ${updatedUser.name} 🙌\n\n🏢 ¿Cómo se llama el billar?\n\nRecuerda que puedes escribir *"menu" o "cancelar"* en cualquier momento para volver al inicio.`,
      );
    },
    TRANSMISSION_CITY: async () => {
      stateData.billiardName = text;
      setStateData(user, stateData);
      await setState(user, "TRANSMISSION_TOURNAMENT_TYPE");
      return client.sendMessage(
        user,
        "📍 ¿En qué ciudad se realizará el torneo?",
      );
    },
    TRANSMISSION_TOURNAMENT_TYPE: async () => {
      stateData.city = text;
      setStateData(user, stateData);
      await setState(user, "TRANSMISSION_TOURNAMENT_SELECT");
      return client.sendMessage(
        user,
        "🎯 ¿Qué tipo de torneo será?\n\n1️⃣ Relámpago (1 día)\n2️⃣ Abierto (varios días)",
      );
    },
    TRANSMISSION_TOURNAMENT_SELECT: async () => {
      if (text === "1") stateData.tournamentType = "RELAMPAGO";
      else if (text === "2") stateData.tournamentType = "ABIERTO";
      else {
        return client.sendMessage(
          user,
          "Responde 1 para Relámpago o 2 para Abierto.",
        );
      }
      setStateData(user, stateData);
      await setState(user, "TRANSMISSION_DATE");
      return client.sendMessage(user, "📅 ¿Qué fecha tienes prevista?");
    },
    TRANSMISSION_DATE: async () => {
      stateData.eventDate = text;
      setStateData(user, stateData);
      await setState(user, "TRANSMISSION_SERVICE_TYPE");
      return client.sendMessage(
        user,
        "🎥 ¿Qué servicio necesitas?\n\n1️⃣ Solo Transmisión\n2️⃣ Solo Organización\n3️⃣ transmisión + organización",
      );
    },
    TRANSMISSION_SERVICE_TYPE: async () => {
      let serviceType;

      if (text === "1") serviceType = "TRANSMISION";
      else if (text === "2") serviceType = "ORGANIZACION";
      else if (text === "3") serviceType = "AMBOS";
      else {
        return client.sendMessage(user, "Por favor escribe 1, 2 o 3.");
      }

      stateData.serviceType = serviceType;
      setStateData(user, stateData);

      // 🔥 BUSCAMOS EL USUARIO EN DB

      // 👇 SI YA TIENE TELEFONO → SALTAMOS EL ESTADO
      if (userData.phone && userData.phone.trim().length > 5) {
        stateData.contactPhone = userData.phone;
        stateData.contactName = userData.name;
        setStateData(user, stateData);

        // 👉 ejecutamos directamente la lógica final
        return await finalizarLeadTransmision(
          client,
          user,
          stateData,
          userData,
        );
      }

      // ❗ Si NO tiene teléfono → lo pedimos
      await setState(user, "TRANSMISSION_CONTACT_PHONE");

      return client.sendMessage(
        user,
        "📱 Por favor escribe tu número de contacto para enviarle la cotización.",
      );
    },

    TRANSMISSION_CONTACT_PHONE: async () => {

  stateData.contactPhone = text;
  setStateData(user, stateData);

  const usuarioDb = await findOrCreateUser(user);

  await updateUserPhoneAndName(
    usuarioDb.whatsappId || user,
    stateData.contactPhone,
    stateData.contactName
  );

  return await finalizarLeadTransmision(
    client,
    user,
    stateData,
    usuarioDb
  );
},

  };

  if (stateHandlers[state]) {
    return await stateHandlers[state]();
  } else {
    return client.sendMessage(user, "Ocurrió un error. Intenta de nuevo.");
  }
};
