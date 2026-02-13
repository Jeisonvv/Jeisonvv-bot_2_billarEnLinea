// Este archivo enruta los mensajes recibidos según la intención detectada.
// Llama al flujo correspondiente o responde con el menú principal si no reconoce la intención.
import { getState, setState } from "./stateManager.js";
import { classifyIntent } from "./aiClassifier.js";
import { storeFlow } from "./flows/store.flow.js";
import { eventsFlow } from "./flows/events.flow.js";
import { infoFlow } from "./flows/info.flow.js";
import { rafflesFlow } from "./flows/raffles.flow.js";
import { tournamentRegisterFlow } from "./flows/tournamentRegister.flow.js";
import { transmissionsFlow } from "./flows/transmissions/transmissions.flow.js";
import { billarInfoFlow } from "./flows/billarInfo.flow.js";
import { findOrCreateUser } from "../services/user.service.js";
import { handleTransmissionSteps } from "./flows/transmissions/transmission.handlers.js";


// Activar modo BILLAR_INFO manualmente desde menú

export const handleMessage = async (client, msg) => {
  // ⏳ Simular que el bot está "escribiendo" antes de responder

  const user = msg.from;
  const text = msg.body?.toLowerCase().trim();
  const userData = await findOrCreateUser(user);
  if (!text) return;
  await findOrCreateUser(user);
  const currentState = await getState(user);
  

  // 🔵 1️⃣ Si ya está en un flujo activo, continuar ese flujo
  if (currentState && currentState !== "IDLE") {
    return continueFlow(client, msg, currentState);
  }

  // 🔵 2️⃣ Activar BILLAR_INFO SOLO si está en IDLE
  if (text.includes("consejos") || text.includes("tips") || text === "6") {
    await setState(user, "BILLAR_INFO_MODE");

    return client.sendMessage(
      user,
      "🎱 *Modo aprendizaje activado*\n" +
        "Puedes preguntarme sobre:\n\n🎱 técnica\n🎱 reglas\n🎱 elección de equipo.\n" +
        "Escribe '*menu o salir*' para salir del modo aprendizaje.",
    );
  }

  // 🔵 3️⃣ Si está libre, clasificar intención
  const intent = await classifyIntent(text);

  switch (intent) {
    case "STORE":
      return storeFlow(client, msg);

    case "EVENTS":
      return eventsFlow(client, msg);

    case "INFO":
      return infoFlow(client, msg);

    case "RAFFLES":
      return rafflesFlow(client, msg);

    case "TOURNAMENT_REGISTER":
      return tournamentRegisterFlow(client, msg);
    case "TRANSMISSIONS":
      return transmissionsFlow(client, msg, userData);

    default:
      return client.sendMessage(
        user,
        "Bienvenido a Billar en Línea 🎱\n\n" +
          "🛒 Tienda\n" +
          "🏆 Transmisiones\n" +
          "🎯 Eventos\n" +
          "🎁 Sorteos\n" +
          "🎱 Consejos y tips de billar\n",
      );
  }
};

// Función para continuar un flujo activo según el estado
const continueFlow = async (client, msg, state) => {
  // ...existing code...
  const user = msg.from;
  const text = msg.body?.toLowerCase().trim();
  const userData = await findOrCreateUser(user);

  if (state === "HUMAN_TAKEOVER") {
    return; // El bot no responde nada
  }

  // 🏆 SUBFLOW TRANSMISSION
  if (typeof state === "string" && state.startsWith("TRANSMISSION_")) {
    return handleTransmissionSteps(client, msg, state, userData);
  }

  switch (state) {
    case "VIEWING_PRODUCTS":
      return client.sendMessage(
        user,
        "Selecciona un producto escribiendo su número.",
      );

    case "BILLAR_INFO_MODE":
      if (
        [
          "menu",
          "menú",
          "salir",
          "volver",
          "inicio",
          "exit",
          "main",
          "cancelar",
          "cancel",
          "home",
        ].includes(text)
      ) {
        await setState(user, "IDLE");

        return client.sendMessage(
          user,
          "Bienvenido nuevamente 🎱\n\n" +
            "🛒 Tienda\n" +
            "🏆 Transmisiones\n" +
            "🎯 Eventos\n" +
            "🎁 Sorteos\n" +
            "🎱 Consejos y tips de billar\n",
        );
      }

      return billarInfoFlow(client, msg);
  }
};
