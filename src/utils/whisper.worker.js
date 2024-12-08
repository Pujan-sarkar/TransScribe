import { HfInference } from "@huggingface/inference";
import { MessageTypes } from "./presets";

class MyTranscriptionPipeline {
  static task = "automatic-speech-recognition";
  static model = "openai/whisper-tiny.en";
  static inference = new HfInference(); // Initialize Hugging Face Inference
  static instance = null;

  static async getInstance() {
    if (this.instance === null) {
      try {
        console.log("Initializing Hugging Face Whisper Pipeline...");
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
  const { type, audio } = event.data;
  if (type === MessageTypes.INFERENCE_REQUEST) {
    await transcribe(audio);
  }
});

async function transcribe(audio) {
  sendLoadingMessage("loading");

  let pipelineInstance;

  try {
    pipelineInstance = await MyTranscriptionPipeline.getInstance();
    if (!pipelineInstance) {
      throw new Error("Pipeline instance is undefined.");
    }
  } catch (err) {
    console.error("Error loading pipeline:", err.message);
    sendLoadingMessage("error");
    return;
  }

  sendLoadingMessage("success");

  try {
    const result = await pipelineInstance.inference.automaticSpeechRecognition({
      model: pipelineInstance.model,
      audio,
    });

    sendResult(result.transcription || "No transcription available.");
  } catch (err) {
    console.error("Error during transcription:", err.message);
    sendLoadingMessage("error");
  }
}

function sendLoadingMessage(status) {
  self.postMessage({
    type: MessageTypes.LOADING,
    status,
  });
}

function sendResult(text) {
  self.postMessage({
    type: MessageTypes.INFERENCE_DONE,
    result: text,
  });
}
