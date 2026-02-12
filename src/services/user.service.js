import User from "../models/user.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const getNow = () => dayjs().tz("America/Bogota").toDate();


// 🔹 1️⃣ Encontrar o crear usuario
export const findOrCreateUser = async (userId) => {
  // userId es el ID completo de WhatsApp (ej: '123456789@c.us')
  let user = await User.findOne({ whatsappId: userId });
  if (!user) {
    user = await User.create({
      whatsappId: userId,
      lastInteraction: getNow()
    });
  }
  return user;
};

// 🔹 2️⃣ Registrar interacción (REUTILIZABLE PARA TODO)
export const registerUserInteraction = async ({
  phone,
  interestType,
  statusUpdate = null
}) => {
  const user = await findOrCreateUser(phone);

  const existingInterest = user.interests.find(
    (i) => i.type === interestType
  );

  if (existingInterest) {
    existingInterest.count += 1;
    existingInterest.lastInteraction = getNow();
  } else {
    user.interests.push({
      type: interestType,
      count: 1,
      lastInteraction: getNow(),
    });
  }

  user.lastInteraction = getNow();

  if (statusUpdate && user.status === "NEW") {
    user.status = statusUpdate;
  }

  await user.save();

  return user;
};

export const upDateName = async (phone, newName) => {
  const user = await findOrCreateUser(phone);
  user.name = newName;
  await user.save();
  return user;
};

export const updateUserPhoneAndName = async (phone, newPhone, newName) => {
  const user = await findOrCreateUser(phone);
  user.phone = newPhone;
  user.name = newName;
  await user.save();
  return user;
};