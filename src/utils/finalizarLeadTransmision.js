import { clearStateData, setState } from "../bot/stateManager.js";
import TransmissionLead from "../models/TransmissionLead.js";
export const finalizarLeadTransmision = async (client, user, stateData, usuarioDb) => {

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

  await client.sendMessage(
    user,
    `✅ Gracias ${stateData.contactName}.\nNuestro equipo revisará la información y te enviará la propuesta en breve.`
  );

  await client.sendMessage(
    process.env.ADMIN_PHONE,
    `📢 NUEVO LEAD TRANSMISIÓN\n\n👤 Contacto: ${stateData.contactName}\n🏢 Billar: ${stateData.billiardName}\n📍 Ciudad: ${stateData.city}\n🎯 Tipo: ${stateData.tournamentType}\n📅 Fecha: ${stateData.eventDate}\n🎥 Servicio: ${stateData.serviceType}\n📱 Tel: ${stateData.contactPhone}`
  );
};
