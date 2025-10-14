import express from "express";
import bodyParser from "body-parser";
import { loadModel, createCompletion } from "gpt4all";

const app = express();
app.use(bodyParser.json());

const PORT = process.env.LLM_SERVER_PORT || 5050;
const MODEL_PATH = process.env.GPT4ALL_MODEL_PATH;

let model: any = null;

// 🔹 Inicializa el modelo (solo una vez)
async function initModel() {
  console.log("🧩 Cargando modelo local desde:", MODEL_PATH);
  const inferenceModel = await loadModel("gpt4all", {
    modelPath: MODEL_PATH,
    device: "cpu", // o "gpu" si tienes soporte
    verbose: true,
  });
  console.log("✅ Modelo cargado exitosamente");
  return inferenceModel;
}

// 🔹 Endpoint principal
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Falta el prompt en el cuerpo." });
    }

    if (!model) {
      model = await initModel();
    }

    console.log("🧠 Prompt recibido:", prompt);

    const completion = await createCompletion(model, prompt, {
      temperature: 0.7,
      topP: 0.9,
      nPredict: 256,
    });

    const text = completion.choices[0].message.content;
    res.json({ response: text });
  } catch (error: any) {
    console.error("❌ Error al generar:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor LLM corriendo en http://localhost:${PORT}`);
});
