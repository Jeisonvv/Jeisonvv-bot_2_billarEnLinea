// Este archivo se encarga de clasificar la intención del mensaje usando la API de OpenAI.
// Devuelve una categoría como: STORE, EVENTS, TOURNAMENT_REGISTER, RAFFLES, INFO u OTHER.
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const classifyIntent = async (message) => {
  // Se construye el prompt para la IA
  const prompt = `
  Clasifica el mensaje en una sola categoría:

  STORE
  EVENTS
  TOURNAMENT_REGISTER
  RAFFLES
  TRANSMISSIONS
  INFO
  OTHER

  Responde solo con la palabra.

  Mensaje: "${message}"
  `

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0
  })

  return response.choices[0].message.content.trim()
}
