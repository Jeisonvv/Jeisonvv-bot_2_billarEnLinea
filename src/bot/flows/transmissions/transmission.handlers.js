import TransmissionLead from "../../../models/TransmissionLead.js";
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

export const handleTransmissionSteps = async (client, msg, state) => {
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

  switch (state) {
    // 1️⃣ Nombre contacto
    case "TRANSMISSION_INITIAL":
      await upDateName(user, text);

      const usuario = await findOrCreateUser(user);
      stateData.contactName = usuario.name;

      setStateData(user, stateData);
      await setState(user, "TRANSMISSION_CITY");

      return client.sendMessage(
        user,
        `Perfecto ${usuario.name} 🙌\n\n🏢 ¿Cómo se llama el billar?`,
      );

    // 2️⃣ Nombre del billar
    case "TRANSMISSION_CITY":
      stateData.billiardName = text;
      setStateData(user, stateData);

      await setState(user, "TRANSMISSION_TOURNAMENT_TYPE");

      return client.sendMessage(
        user,
        "📍 ¿En qué ciudad se realizará el torneo?",
      );

    // 3️⃣ Ciudad
    case "TRANSMISSION_TOURNAMENT_TYPE":
      stateData.city = text;
      setStateData(user, stateData);

      await setState(user, "TRANSMISSION_TOURNAMENT_SELECT");

      return client.sendMessage(
        user,
        "🎯 ¿Qué tipo de torneo será?\n\n" +
          "1️⃣ Relámpago (1 día)\n" +
          "2️⃣ Abierto (varios días)",
      );

    // 4️⃣ Tipo torneo
    case "TRANSMISSION_TOURNAMENT_SELECT":
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

    // 5️⃣ Fecha
    case "TRANSMISSION_DATE":
      stateData.eventDate = text;
      setStateData(user, stateData);

      await setState(user, "TRANSMISSION_SERVICE_TYPE");

      return client.sendMessage(
        user,
        "🎥 ¿Qué servicio necesitas?\n\n" +
          "1️⃣ Solo Transmisión\n" +
          "2️⃣ Solo Organización\n" +
          "3️⃣ transmisión + organización",
      );

    // 6️⃣ Servicio FINAL → aquí se crea el lead
    case "TRANSMISSION_SERVICE_TYPE":
      let serviceType;
      if (text === "1") serviceType = "TRANSMISION";
      else if (text === "2") serviceType = "ORGANIZACION";
      else if (text === "3") serviceType = "AMBOS";
      else {
        return client.sendMessage(user, "Por favor escribe 1, 2 o 3.");
      }
      stateData.serviceType = serviceType;
      setStateData(user, stateData);
      await setState(user, "TRANSMISSION_CONTACT_PHONE");
      return client.sendMessage(user, "📱 Por favor escribe tu número de contacto para enviarle la cotización.");

    // 7️⃣ Número de contacto
    case "TRANSMISSION_CONTACT_PHONE":
      stateData.contactPhone = text;
      setStateData(user, stateData);
      const usuarioDb = await findOrCreateUser(user);
      // Actualizar el usuario con whatsappId, nombre y teléfono
      await updateUserPhoneAndName(
        usuarioDb.whatsappId || user,
        stateData.contactPhone,
        stateData.contactName
      );
      await TransmissionLead.create({
        user: usuarioDb._id,
        phone: stateData.contactPhone,
        contactName: stateData.contactName,
        billiardName: stateData.billiardName,
        city: stateData.city,
        tournamentType: stateData.tournamentType,
        eventDate: stateData.eventDate,
        serviceType: stateData.serviceType,
        status: "PENDING",
      });
      clearStateData(user);
      await setState(user, "HUMAN_TAKEOVER");
      // ✅ Usuario
      await client.sendMessage(
        user,
        `✅ Gracias ${stateData.contactName}.
Nuestro equipo revisará la información y te enviará la propuesta en breve.`,
      );
      // 🔔 Admin
      await client.sendMessage(
        process.env.ADMIN_PHONE,
        `📢 NUEVO LEAD TRANSMISIÓN\n\n👤 Contacto: ${stateData.contactName}\n🏢 Billar: ${stateData.billiardName}\n📍 Ciudad: ${stateData.city}\n🎯 Tipo: ${stateData.tournamentType}\n📅 Fecha: ${stateData.eventDate}\n🎥 Servicio: ${stateData.serviceType}\n📱 Tel: ${stateData.contactPhone}`,
      );
      return;
  }
};
