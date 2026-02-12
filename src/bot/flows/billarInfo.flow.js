import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Este archivo define el flujo para información especial de billar.
// Responde a los usuarios que preguntan por detalles específicos de billar.

export const billarInfoFlow = async (client, msg) => {

  const user = msg.from
  const question = msg.body

  try {

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Eres asesor experto de Billar en Línea 🎱.

Tu misión es educar a los jugadores y ayudarlos a mejorar su técnica.
También puedes orientarlos sobre qué tipo de equipo es ideal según su nivel.

Reglas:
- Responde claro, práctico y profesional.
- Da consejos reales, no genéricos.
- Mantén respuestas medianas (ni muy cortas ni muy largas).
- Si tiene sentido, sugiere el tipo de producto adecuado,
  pero sin insistir en vender.
- Nunca fuerces una compra.
- Si preguntan algo fuera del billar, responde que solo ayudas con billar.

Habla en tono cercano pero experto.
`
        },
        {
          role: "user",
          content: question
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    })

    const answer = response.choices[0].message.content

    await client.sendMessage(user, answer)

  } catch (error) {
    console.error("Error en BILLAR_INFO:", error)

    await client.sendMessage(
      user,
      "Hubo un problema procesando tu pregunta. Intenta nuevamente."
    )
  }
}
