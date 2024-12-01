import { useState, useRef, useEffect } from "react";
import HomePage from "./components/HomePage";
import Header from "./components/Header";
import FileDisplay from "./components/FileDisplay";
import Information from "./components/Information";
import Transcribing from "./components/Transcribing";
import { MessageTypes } from "./utils/presets";

function App() {
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [output, setOutput] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  const isAudioAvailable = file || audioStream;
  const worker = useRef(null);

  function handleAudioReset() {
    setFile(null);
    setAudioStream(null);
  }

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL("./utils/whisper.worker.js", import.meta.url),
        {
          type: "module",
        }
      );
    }

    const onMessageReceived = (e) => {
      switch (e.data.type) {
        case "DOWNLOADING":
          setDownloading(true);
          console.log("DOWNLOADING");
          break;
        case "LOADING":
          setLoading(true);
          console.log("LOADING");
          break;
        case "RESULT":
          setOutput(e.data.results);
          console.log(e.data.results);
          break;
        case "INFERENCE_DONE":
          setFinished(true);
          console.log("DONE");
          break;
        default:
          console.warn("Unknown message type:", e.data.type);
          break;
      }
    };

    worker.current.addEventListener("message", onMessageReceived);

    return () => {
      if (worker.current) {
        worker.current.removeEventListener("message", onMessageReceived);
        worker.current.terminate(); // Clean up worker
        worker.current = null;
      }
    };
  }, []);

  async function readAudioForm(file) {
    try {
      const sampling_rate = 16000;
      const audioCTX = new AudioContext({ sampleRate: sampling_rate });
      const respond = await file.arrayBuffer(); // Corrected variable name
      const decode = await audioCTX.decodeAudioData(respond); // Decode respond
      const audio = decode.getChannelData(0); // Get audio data
      return audio;
    } catch (error) {
      console.error("Error in readAudioForm:", error);
      throw error;
    }
  }

  async function handleFormSubmission() {
    if (!file && !audioStream) {
      console.warn("No audio file or stream available for submission.");
      return;
    }

    try {
      let audio = await readAudioForm(file ? file : audioStream);
      const model_name = `openai/whisper-tiny.en`;

      worker.current.postMessage({
        type: MessageTypes.INFERENCE_REQUEST,
        audio,
        model_name,
      });
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  }

  return (
    <div className="flex flex-col p-4 max-w-[1000px] mx-auto w-full">
      <section className="min-h-screen flex flex-col">
        <Header />
        {output ? (
          <Information output={output} />
        ) : loading ? (
          <Transcribing />
        ) : isAudioAvailable ? (
          <FileDisplay
            handleFormSubmission={handleFormSubmission}
            handleAudioReset={handleAudioReset}
            file={file}
            audioStream={setAudioStream}
          />
        ) : (
          <HomePage setFile={setFile} setAudioStream={setAudioStream} />
        )}
      </section>
      <h1 className="text-green-500">Hello World</h1>
      <footer></footer>
    </div>
  );
}

export default App;
