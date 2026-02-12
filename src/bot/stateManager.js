// Importa el modelo de usuario para interactuar con la base de datos
import User from "../models/user.js";

// Obtiene el estado actual del usuario (flujo en el que está)
export const getState = async (whatsappId) => {
  const user = await User.findOne({ whatsappId });
  // Si no tiene estado, retorna "IDLE" (sin flujo activo)
  return user?.currentState || "IDLE";
};

// Actualiza el estado actual del usuario en la base de datos
export const setState = async (whatsappId, state) => {
  await User.findOneAndUpdate(
    { whatsappId },
    { currentState: state }
  );
};

// Guarda datos temporales del flujo (por ejemplo, respuestas del usuario)
export const setStateData = async (whatsappId, data) => {
  await User.findOneAndUpdate(
    { whatsappId },
    { stateData: data }
  );
};

// Obtiene los datos temporales guardados del usuario
export const getStateData = async (whatsappId) => {
  const user = await User.findOne({ whatsappId });
  return user?.stateData || {};
};

// Limpia los datos temporales del usuario (para reiniciar el flujo)
export const clearStateData = async (whatsappId) => {
  await User.findOneAndUpdate(
    { whatsappId },
    { stateData: {} }
  );
};
