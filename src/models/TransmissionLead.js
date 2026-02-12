import mongoose from "mongoose";

const transmissionLeadSchema = new mongoose.Schema(
  {
    // Relación con usuario
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Teléfono del contacto
    phone: {
      type: String,
      required: true
    },

    // Nombre del billar o club
    billiardName: {
      type: String,
      required: true
    },

    // Ciudad donde será el evento
    city: {
      type: String,
      required: true
    },

    // Tipo de torneo
    tournamentType: {
      type: String,
      enum: ["RELAMPAGO", "ABIERTO"],
      required: true
    },

    // Fecha del evento
    eventDate: String,

    // Tipo de servicio solicitado
    serviceType: {
      type: String,
      enum: [
        "TRANSMISION",
        "ORGANIZACION",
        "AMBOS"
      ],
      required: true
    },

    // Estado comercial del lead
    status: {
      type: String,
      enum: [
        "PENDING",
        "CONTACTED",
        "QUOTED",
        "NEGOTIATION",
        "CLOSED",
        "CANCELLED"
      ],
      default: "PENDING"
    },

    // Notas internas
    notes: String
  },
  {
    timestamps: true // crea createdAt y updatedAt automático
  }
);

export default mongoose.models.TransmissionLead || mongoose.model("TransmissionLead", transmissionLeadSchema);
