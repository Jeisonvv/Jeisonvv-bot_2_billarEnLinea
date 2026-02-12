import whatsapp from "whatsapp-web.js";
const { Client, LocalAuth } = whatsapp;
import { handleMessage } from "./router.js";
import qrcode from "qrcode-terminal";


export const initBot = async () => {
  const client = new Client({
    authStrategy: new LocalAuth(),
  });

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("Escanea el QR mostrado arriba para conectar tu WhatsApp");
  });

  client.on("ready", () => {
    console.log("Bot listo 🎱");
  });

  client.on("message", async (msg) => {
    // ❌ Ignorar mensajes propios
    if (msg.fromMe) return;

    // ❌ Ignorar grupos
    if (msg.from.endsWith("@g.us")) return;

    // ❌ Ignorar estados
    if (msg.from === "status@broadcast") return;

    // ...existing code...
    await handleMessage(client, msg);
  });

  await client.initialize();
};
