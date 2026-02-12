import express from "express"
import { initBot } from "./bot/index.js"
import { connectDB } from "../database/mongo.js";
import { createTransmissionLead } from "./services/transmission.service.js";


connectDB();

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Bot Billar en Línea activo 🎱")
})

app.listen(3000, async () => {
  console.log("Servidor corriendo en puerto 3000")
  await initBot()
})