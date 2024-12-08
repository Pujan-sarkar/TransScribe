import { HfInference } from "@huggingface/inference";

class MyTranslationPipeline {
  static task = "translation";
  static model = "facebook/nllb-200-distilled-600M"; // Using a Hugging Face-hosted model
  static inference = new HfInference(); // Initialize Hugging Face Inference
  static instance = null;

  static async getInstance() {
    if (this.instance === null) {
      console.log("Initializing Hugging Face Translation Pipeline...");
      try {
        this.instance = {
          task: this.task,
          model: this.model,
          inference: this.inference,
        };
        console.log("Pipeline successfully initialized.");
      } catch (err) {
        console.error("Failed to initialize pipeline:", err.message);
        throw new Error("Pipeline initialization failed");
      }
    }
    return this.instance;
  }
}

self.addEventListener("message", async (event) => {
  const { text, tgt_lang, src_lang } = event.data;

  let translator;
  try {
    translator = await MyTranslationPipeline.getInstance();
  } catch (err) {
    console.error("Error initializing translation pipeline:", err.message);
    self.postMessage({
      status: "error",
      message: "Failed to initialize translation pipeline.",
    });
    return;
  }

  console.log("Received text:", text);
  sendLoadingMessage("loading");

  try {
    const result = await translator.inference.translation({
      model: translator.model,
      inputs: text,
      parameters: {
        source_lang: src_lang,
        target_lang: tgt_lang,
      },
    });

    self.postMessage({
      status: "complete",
      output: result.translations[0].text || "No translation available",
    });
  } catch (err) {
    console.error("Error during translation:", err.message);
    self.postMessage({
      status: "error",
      message: "Translation failed.",
    });
  }
});

function sendLoadingMessage(status) {
  self.postMessage({
    status,
  });
}
