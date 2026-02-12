import TransmissionLead from "../models/TransmissionLead.js";

export const createTransmissionLead = async (data) => {
  return await TransmissionLead.create(data);
};
