import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { loadModel, createCompletion } from "gpt4all";
import type { InferenceModel } from "gpt4all";

const app = express();
app.use(bodyParser.json());

const PORT = process.env.LLM_SERVER_PORT || 5050;
const MODEL_PATH = process.env.GPT4ALL_MODEL_PATH || "C:\Users\bortiz\AppData\Local\nomic.ai\GPT4All\Llama-3.2-1B-Instruct-Q4_0.gguf";

// 🔹 Usa un tipo genérico en lugar de `any`

let model: InferenceModel | null = null;

// 🔹 Inicializa el modelo
async function initModel(): Promise<InferenceModel> {
  console.log("🧩 Cargando modelo local desde:", MODEL_PATH);
  const inferenceModel = await loadModel("gpt4all", {
    modelPath: MODEL_PATH,
    device: "cpu",
    verbose: true,
  });
  console.log("✅ Modelo cargado exitosamente");
  return inferenceModel;
}

// 🔹 Endpoint principal
app.post("/generate", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (typeof prompt !== "string" || !prompt.trim()) {
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

    const text = completion?.choices?.[0]?.message?.content ?? "";
    res.json({ response: text });
  } catch (error: unknown) {
    // ✅ sin `any`, manejo seguro
    const message =
      error instanceof Error ? error.message : "Error desconocido al generar.";
    console.error("❌ Error al generar:", message);
    res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor LLM corriendo en http://localhost:${PORT}`);
});
